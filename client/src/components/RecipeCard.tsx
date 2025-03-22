import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeSummary, addFavoriteRecipe, removeFavoriteRecipe } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RecipeCardProps {
  recipe: RecipeSummary;
  onClick: () => void;
  isFavorite?: boolean;
}

export default function RecipeCard({ recipe, onClick, isFavorite = false }: RecipeCardProps) {
  const [favorite, setFavorite] = useState(isFavorite);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get calories from recipe nutrition data if available
  const calories = recipe.nutrition?.nutrients.find(n => n.name === "Calories")?.amount || 0;

  // Extract diets from recipe if available, or use an empty array
  const diets = recipe.diets || [];

  // Add recipe to favorites
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteRecipe,
    onSuccess: () => {
      toast({
        title: "Added to favorites",
        description: `${recipe.title} has been added to your favorites.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {
      setFavorite(false);
      toast({
        title: "Error",
        description: "Failed to add recipe to favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove recipe from favorites
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteRecipe,
    onSuccess: () => {
      toast({
        title: "Removed from favorites",
        description: `${recipe.title} has been removed from your favorites.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: () => {
      setFavorite(true);
      toast({
        title: "Error",
        description: "Failed to remove recipe from favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    if (newFavoriteState) {
      addFavoriteMutation.mutate(recipe.id);
    } else {
      removeFavoriteMutation.mutate(recipe.id);
    }
  };

  // Get cuisine type or default to a category
  let cuisineType = "Other";
  if (recipe.cuisines && recipe.cuisines.length > 0) {
    cuisineType = recipe.cuisines[0];
  } else if (recipe.dishTypes && recipe.dishTypes.length > 0) {
    cuisineType = recipe.dishTypes[0];
  }
  
  return (
    <div 
      className="recipe-card bg-white shadow-sm animate-fade-in"
      onClick={onClick}
    >
      <div className="relative overflow-hidden group">
        <img 
          src={recipe.image} 
          alt={recipe.title} 
          className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute top-2 right-2 z-10">
          <button 
            className="text-white p-2 rounded-full bg-black/40 hover:bg-primary/90 transition-all duration-300 hover:scale-110"
            onClick={toggleFavorite}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <i className={`${favorite ? 'fas text-primary' : 'far'} fa-heart text-lg`}></i>
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-white text-sm font-medium">
              Click for details
            </span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex items-center justify-between">
            <span className="text-white text-xs font-medium px-2.5 py-1 rounded-full bg-primary/90 shadow-sm">
              {cuisineType}
            </span>
            <span className="text-white text-xs font-medium flex items-center bg-black/50 px-2.5 py-1 rounded-full">
              <i className="far fa-clock mr-1.5"></i> {recipe.readyInMinutes} min
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
        <div className="flex items-center text-sm text-neutral-700 mb-3">
          <div className="flex items-center mr-4">
            <i className="fas fa-utensils text-primary mr-1.5"></i>
            <span>{recipe.extendedIngredients?.length || "?"} ingredients</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-fire text-primary mr-1.5"></i>
            <span>{Math.round(calories)} cal</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {diets.slice(0, 3).map((diet: string, index: number) => (
            <span 
              key={index} 
              className="badge-primary text-xs"
            >
              {diet}
            </span>
          ))}
          {diets.length > 3 && (
            <span className="badge-primary text-xs">+{diets.length - 3} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
