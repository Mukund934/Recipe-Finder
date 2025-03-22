import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { getFavoriteRecipes, getRecipeDetails, isAuthenticated } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorites() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [, navigate] = useLocation();
  
  // Check authentication on mount
  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsUserAuthenticated(authenticated);
    
    if (!authenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Get favorite recipe IDs
  const { data: favoriteIds, isLoading: isLoadingIds } = useQuery({
    queryKey: ["/api/favorites"],
    queryFn: getFavoriteRecipes,
    enabled: isUserAuthenticated,
  });

  // Get recipe details for all favorite recipes
  const { data: favoriteRecipes, isLoading: isLoadingRecipes } = useQuery({
    queryKey: ["/api/favorites/details", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds || favoriteIds.length === 0) return [];
      const recipes = await Promise.all(
        favoriteIds.map(id => getRecipeDetails(id))
      );
      return recipes;
    },
    enabled: isUserAuthenticated && !!favoriteIds && favoriteIds.length > 0,
  });

  // Get details for the selected recipe
  const { data: selectedRecipe, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/recipe", selectedRecipeId],
    queryFn: () => getRecipeDetails(selectedRecipeId!),
    enabled: !!selectedRecipeId,
  });

  const handleRecipeClick = (recipeId: number) => {
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const isLoading = isLoadingIds || isLoadingRecipes;

  return (
    <main className="flex-grow container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-4">Your Favorite Recipes</h1>
        <p className="text-neutral-700">
          Find all your saved recipes in one place. Click on any recipe to view its details.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
              <Skeleton className="w-full h-48" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : favoriteRecipes && favoriteRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-4xl mb-4">
            <i className="far fa-heart text-primary opacity-50"></i>
          </div>
          <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
          <p className="text-neutral-600 mb-6">
            You haven't saved any recipes to your favorites.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded font-medium hover:bg-primary/90 transition"
          >
            <i className="fas fa-search mr-2"></i> Find Recipes
          </Link>
        </div>
      )}

      {selectedRecipeId && (
        <RecipeDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          isLoading={isLoadingDetails}
        />
      )}
    </main>
  );
}
