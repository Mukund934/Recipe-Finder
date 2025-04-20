# Recipe Finder

A full-stack application that helps users discover recipes based on their preferences and dietary requirements, with the ability to save favorites and customize their experience.

## Live Demo

Visit the live application at [recipe-finder-khaki-five.vercel.app](https://recipe-finder-khaki-five.vercel.app)

## Features

- Search recipes by name, ingredients, cuisine, or dietary preferences
- View detailed recipe information including ingredients and instructions
- Save favorite recipes to your profile
- User authentication and profile management
- Responsive design for mobile and desktop

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui components
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (user data), Drizzle ORM (favorites)
- **API**: Spoonacular Recipe API
- **Authentication**: JWT-based authentication
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ installed
- A Spoonacular API key (get one at [spoonacular.com/food-api](https://spoonacular.com/food-api))
- MongoDB connection string

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mukund934/Recipe-Finder.git
   cd Recipe-Finder
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with:
   ```
   SPOONACULAR_API_KEY=your_api_key
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Create a `.env` file in the `client` directory:
   ```
   VITE_SPOONACULAR_API_KEY=your_api_key
   ```

### Development

Run the development server:

```bash
npm run dev
```

This will start both the client (on port 3000) and server (on port 5000) concurrently.

### Building for Production

```bash
npm run build
```

This will build both the client and server for production deployment.

## Deployment on Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to your Vercel account:
   ```bash
   vercel login
   ```

3. Set up environment variables in Vercel:
   - MONGODB_URI: Your MongoDB connection string
   - JWT_SECRET: Secret key for JWT authentication
   - SPOONACULAR_API_KEY: Your Spoonacular API key

4. Deploy the application:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### User
- `GET /api/user/profile` - Get the current user's profile
- `PATCH /api/user/preferences` - Update user preferences

### Favorites
- `GET /api/favorites` - Get all favorite recipes for the current user
- `POST /api/favorites` - Add a recipe to favorites
- `DELETE /api/favorites/:recipeId` - Remove a recipe from favorites

## License

MIT