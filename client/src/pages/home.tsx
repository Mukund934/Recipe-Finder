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
  // Auth state
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilters, setDietFilters] = useState<Diet[]>([]);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [maxCookingTime, setMaxCookingTime] = useState(30);
  const [ingredientFilters, setIngredientFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  const [page, setPage] = useState(1);
  
  // Modal state
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Results per page
  const RESULTS_PER_PAGE = 9;
  
  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsUserAuthenticated(authenticated);
      
      if (authenticated) {
        const user = getCurrentUser();
        if (user) {
          setUserName(user.name);
        }
      }
    };
    
    checkAuth();
    
    // Setup event listener for auth state changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'recipe_finder_token' || e.key === 'recipe_finder_user') {
        checkAuth();
      }
    });
    
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  // Search recipes query
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

  // Get recipe details for the selected recipe
  const { data: recipeDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["/api/recipe", selectedRecipeId],
    queryFn: () => getRecipeDetails(selectedRecipeId!),
    enabled: !!selectedRecipeId,
  });
  
  // Personalized recipe recommendations for authenticated users
  const { 
    data: recommendedRecipes, 
    isLoading: isLoadingRecommendations 
  } = useQuery({
    queryKey: ["/api/recommendations"],
    queryFn: getRecommendedRecipes,
    enabled: isUserAuthenticated,
  });

  // Handler functions
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
      
      {/* Personalized Recommendations Section */}
      {isUserAuthenticated && (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
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
<<<<<<< HEAD
          </div>
          
          <h3 className="text-xl font-medium mb-4 text-gray-800">Recommended for you</h3>
          
          {isLoadingRecommendations && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={`skeleton-${i}`} 
                  className="bg-white rounded-xl p-4 h-64 skeleton-pulse shadow-sm"
=======
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-primary">
              Hello {userName}! Recommended for you
            </h2>
=======
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
          </div>
          
          <h3 className="text-xl font-medium mb-4 text-gray-800">Recommended for you</h3>
          
          {isLoadingRecommendations && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={`skeleton-${i}`} 
<<<<<<< HEAD
                  className="bg-gray-100 rounded-lg p-4 h-64 animate-pulse"
>>>>>>> aee125c (Add user authentication and personalized recipe recommendations.)
=======
                  className="bg-white rounded-xl p-4 h-64 skeleton-pulse shadow-sm"
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
                />
              ))}
            </div>
          )}
          
          {!isLoadingRecommendations && recommendedRecipes?.results && (
<<<<<<< HEAD
<<<<<<< HEAD
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 stagger-animation">
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto pb-2">
>>>>>>> aee125c (Add user authentication and personalized recipe recommendations.)
=======
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-2 stagger-animation">
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
              {recommendedRecipes.results.slice(0, 3).map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => handleRecipeClick(recipe.id)}
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
                  className="cursor-pointer transition-transform hover:scale-105"
=======
                  className="recipe-card cursor-pointer"
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
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
<<<<<<< HEAD
                    <div className="p-4">
                      <h3 className="font-semibold text-lg line-clamp-2">{recipe.title}</h3>
                    </div>
>>>>>>> aee125c (Add user authentication and personalized recipe recommendations.)
=======
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
      <div className="flex flex-col lg:flex-row gap-8 animate-fade-in" style={{animationDelay: "0.2s"}}>
        <aside className="lg:w-1/4">
          <FilterPanel 
            activeDiets={dietFilters}
            activeCuisine={cuisineFilter}
            activeTime={maxCookingTime}
            activeIngredients={ingredientFilters}
            onFilterChange={handleFilterChange}
          />
        </aside>
<<<<<<< HEAD
=======
      <div className="flex flex-col md:flex-row gap-6">
        <FilterPanel 
          activeDiets={dietFilters}
          activeCuisine={cuisineFilter}
          activeTime={maxCookingTime}
          activeIngredients={ingredientFilters}
          onFilterChange={handleFilterChange}
        />
>>>>>>> aee125c (Add user authentication and personalized recipe recommendations.)
=======
>>>>>>> 54d573e (Enhance recipe card UI with animations, hover effects, and responsive design; improve overall aesthetics and user experience.)
        
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
