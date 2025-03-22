import { InsertFavorite, Favorite } from "@shared/schema";

export interface IStorage {
  getFavorites(userId: number): Promise<Favorite[]>;
  getFavorite(userId: number, recipeId: number): Promise<Favorite | undefined>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, recipeId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private favorites: Map<string, Favorite>;
  private currentId: number;

  constructor() {
    this.favorites = new Map();
    this.currentId = 1;
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    const userFavorites: Favorite[] = [];
    
    this.favorites.forEach((favorite) => {
      if (favorite.userId === userId) {
        userFavorites.push(favorite);
      }
    });
    
    return userFavorites;
  }

  async getFavorite(userId: number, recipeId: number): Promise<Favorite | undefined> {
    const key = `${userId}-${recipeId}`;
    return this.favorites.get(key);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentId++;
    const newFavorite: Favorite = { ...favorite, id };
    
    const key = `${favorite.userId}-${favorite.recipeId}`;
    this.favorites.set(key, newFavorite);
    
    return newFavorite;
  }

  async removeFavorite(userId: number, recipeId: number): Promise<void> {
    const key = `${userId}-${recipeId}`;
    this.favorites.delete(key);
  }
}

export const storage = new MemStorage();
