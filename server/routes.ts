import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertFavoriteSchema } from "@shared/schema";
import { connectToDatabase } from "./db/mongodb";
import User from "./models/User";
import jwt from "jsonwebtoken";

// Interface to extend Express Request with a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}

// Middleware to verify JWT token
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'recipe-finder-secret-key';

    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
      
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server error during authentication' });
  }
};

// Schema for user registration
const registerSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

// Schema for user login
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Schema for updating user preferences
const updatePreferencesSchema = z.object({
  dietPreferences: z.array(z.string()).optional(),
  favoriteIngredients: z.array(z.string()).optional(),
  favoriteCuisines: z.array(z.string()).optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to the MongoDB database
  await connectToDatabase();

  // Registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Create new user
      const user = new User({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      });
      
      await user.save();
      
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await User.findOne({ email: validatedData.email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(validatedData.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const secret = process.env.JWT_SECRET || 'recipe-finder-secret-key';
      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        secret,
        { expiresIn: '7d' }
      );
      
      res.json({ 
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          dietPreferences: user.dietPreferences,
          favoriteIngredients: user.favoriteIngredients,
          favoriteCuisines: user.favoriteCuisines
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Get user profile
  app.get("/api/user/profile", authenticate, async (req, res) => {
    try {
      const user = await User.findById(req.user?.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  // Update user preferences
  app.patch("/api/user/preferences", authenticate, async (req, res) => {
    try {
      const validatedData = updatePreferencesSchema.parse(req.body);
      
      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { $set: validatedData },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
        });
      }
      console.error("Preferences update error:", error);
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Current mock user ID (in a real app, this would come from authentication)
  const MOCK_USER_ID = 1;

  // Get all favorites for the current user
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavorites(MOCK_USER_ID);
      // Return just the recipe IDs for the frontend
      const recipeIds = favorites.map(fav => fav.recipeId);
      res.json(recipeIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add a recipe to favorites
  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse({
        userId: MOCK_USER_ID,
        recipeId: req.body.recipeId,
      });
      
      // Check if the favorite already exists
      const existing = await storage.getFavorite(MOCK_USER_ID, req.body.recipeId);
      if (existing) {
        return res.status(400).json({ message: "Recipe is already in favorites" });
      }
      
      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  // Remove a recipe from favorites
  app.delete("/api/favorites/:recipeId", async (req, res) => {
    try {
      const recipeId = parseInt(req.params.recipeId);
      if (isNaN(recipeId)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      // Check if the favorite exists
      const existing = await storage.getFavorite(MOCK_USER_ID, recipeId);
      if (!existing) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      
      await storage.removeFavorite(MOCK_USER_ID, recipeId);
      res.status(204).end();
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
