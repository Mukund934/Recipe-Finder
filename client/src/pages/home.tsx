import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/HeroSection";
import FilterPanel from "@/components/FilterPanel";
import RecipeResults from "@/components/RecipeResults";
import RecipeDetailModal from "@/components/RecipeDetailModal";
import { 
  searchRecipes, 
  Diet, 
  SortOption, 
  RecipeSummary, 
  RecipeDetail, 
  getRecipeDetails,
  getRecommendedRecipes,
  isAuthenticated,
  getCurrentUser
} from "@/lib/api";

export default function Home() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilters, setDietFilters] = useState<Diet[]>([]);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const [ingredientFilters, setIngredientFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);

  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const RESULTS_PER_PAGE = 9;

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      if (authenticated) {
        const user = getCurrentUser();
        if (user) setUserName(user.name);
      }
    };

    checkAuth();

    const listener = (e: StorageEvent) => {
      if (e.key === 'recipe_finder_token' || e.key === 'recipe_finder_user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);

  const { data: searchResults, isLoading, isError } = useQuery({
    queryKey: [
      "/api/search",
      searchQuery,
      dietFilters,
      cuisineFilter,
      maxCookingTime,
      ingredientFilters,
      sortOption,
      page,
    ],
    queryFn: () =>
      searchRecipes({
        query: searchQuery,
        diet: dietFilters,
        cuisine: cuisineFilter || undefined,
        maxReadyTime: maxCookingTime,
        includeIngredients: ingredientFilters.length > 0 ? ingredientFilters : undefined,
        sort: sortOption,
        offset: (page - 1) * RESULTS_PER_PAGE,
        number: RESULTS_PER_PAGE,
      }),
  });

  const { data: recipeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/recipe", selectedRecipeId],
    queryFn: () => getRecipeDetails(selectedRecipeId!),
    enabled: !!selectedRecipeId,
  });

  const { data: recommendedRecipes, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/recommendations"],
    queryFn: getRecommendedRecipes,
    enabled: isUserAuthenticated,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (
    diets: Diet[], 
    cuisine: string, 
    time: number,
    ingredients: string[]
  ) => {
    setDietFilters(diets);
    setCuisineFilter(cuisine);
    setMaxCookingTime(time);
    setIngredientFilters(ingredients);
    setPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    setPage(1);
  };

  const handleRecipeClick = (recipeId: number) => {
    setSelectedRecipeId(recipeId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="flex-grow container-fluid py-6">
      <div className="animate-fade-in">
        <HeroSection onSearch={handleSearch} />
      </div>

      {isUserAuthenticated && (
        <div className="mb-12 animate-slide-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <h2 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Hello {userName}!
                </span>
              </h2>
              <div className="h-1 w-1/2 bg-gradient-to-r from-primary to-orange-400 rounded mt-1"></div>
            </div>
          </div>

          <h3 className="text-xl font-medium mb-4 text-gray-800">Recommended for you</h3>

          {isLoadingRecommendations && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={`skeleton-${i}`} 
                  className="bg-white rounded-xl p-4 h-64 skeleton-pulse shadow-sm"
                />
              ))}
            </div>
          )}

          {!isLoadingRecommendations && recommendedRecipes?.results && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 stagger-animation">
              {recommendedRecipes.results.slice(0, 3).map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe.id)}
                  className="recipe-card cursor-pointer"
                >
                  <div className="relative overflow-hidden group">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title}
                      className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-medium text-white text-lg line-clamp-2 drop-shadow-md">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center mt-2">
                        <span className="text-white text-sm bg-primary/80 px-2.5 py-1 rounded-full inline-flex items-center">
                          <i className="far fa-clock mr-1.5"></i> {recipe.readyInMinutes} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <aside className="lg:w-1/4">
          <FilterPanel 
            activeDiets={dietFilters}
            activeCuisine={cuisineFilter}
            activeTime={maxCookingTime}
            activeIngredients={ingredientFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        <div className="lg:w-3/4">
          <RecipeResults 
            isLoading={isLoading}
            results={searchResults}
            activeFilters={{
              diets: dietFilters,
              cuisine: cuisineFilter,
              maxTime: maxCookingTime,
              ingredients: ingredientFilters
            }}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            onRecipeClick={handleRecipeClick}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {selectedRecipeId && (
        <RecipeDetailModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          recipe={recipeDetails}
          isLoading={isLoadingDetails}
        />
      )}
    </main>
  );
}
