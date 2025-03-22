import { SortOption, Diet, SearchResponse } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ActiveFilters {
  diets: Diet[];
  cuisine: string;
  maxTime: number;
  ingredients: string[];
}

interface RecipeResultsProps {
  isLoading: boolean;
  results?: SearchResponse;
  activeFilters: ActiveFilters;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  onRecipeClick: (recipeId: number) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function RecipeResults({
  isLoading,
  results,
  activeFilters,
  sortOption,
  onSortChange,
  onRecipeClick,
  currentPage,
  onPageChange
}: RecipeResultsProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption);
  };

  const handleRemoveFilter = (filterType: keyof ActiveFilters, value?: string) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'diets' && value) {
      newFilters.diets = newFilters.diets.filter(diet => diet !== value);
    } else if (filterType === 'cuisine') {
      newFilters.cuisine = '';
    } else if (filterType === 'maxTime') {
      newFilters.maxTime = 60;
    } else if (filterType === 'ingredients' && value) {
      newFilters.ingredients = newFilters.ingredients.filter(ing => ing !== value);
    }
    
    // Use currentPage 1 since filters changed
    onSortChange(sortOption);
  };

  const totalPages = results?.totalResults 
    ? Math.ceil(results.totalResults / (results.number || 10)) 
    : 0;

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-heading font-semibold">Recipes</h2>
        <div>
          <select 
            className="p-2 border border-neutral-300 rounded text-sm"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="time">Sort by: Cooking Time</option>
            <option value="popularity">Sort by: Popularity</option>
          </select>
        </div>
      </div>
      
      {/* Active Filters */}
      {(activeFilters.diets.length > 0 || activeFilters.cuisine || activeFilters.maxTime < 60 || activeFilters.ingredients.length > 0) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeFilters.diets.map(diet => (
            <span 
              key={diet} 
              className="inline-flex items-center px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm"
            >
              {diet.charAt(0).toUpperCase() + diet.slice(1)}
              <button 
                className="ml-1 text-neutral-500 hover:text-neutral-700"
                onClick={() => handleRemoveFilter('diets', diet)}
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          ))}
          
          {activeFilters.cuisine && (
            <span className="inline-flex items-center px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm">
              Cuisine: {activeFilters.cuisine.charAt(0).toUpperCase() + activeFilters.cuisine.slice(1)}
              <button 
                className="ml-1 text-neutral-500 hover:text-neutral-700"
                onClick={() => handleRemoveFilter('cuisine')}
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          )}
          
          {activeFilters.maxTime < 60 && (
            <span className="inline-flex items-center px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm">
              Max: {activeFilters.maxTime} min
              <button 
                className="ml-1 text-neutral-500 hover:text-neutral-700"
                onClick={() => handleRemoveFilter('maxTime')}
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          )}
          
          {activeFilters.ingredients.map(ingredient => (
            <span 
              key={ingredient} 
              className="inline-flex items-center px-3 py-1 bg-neutral-200 text-neutral-700 rounded-full text-sm"
            >
              Ingredient: {ingredient}
              <button 
                className="ml-1 text-neutral-500 hover:text-neutral-700"
                onClick={() => handleRemoveFilter('ingredients', ingredient)}
              >
                <i className="fas fa-times"></i>
              </button>
            </span>
          ))}
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
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
      )}
      
      {/* Results Grid */}
      {!isLoading && results && results.results.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.results.map(recipe => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe}
                onClick={() => onRecipeClick(recipe.id)}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center">
                <button 
                  className="px-3 py-1 border border-neutral-300 rounded-l-md bg-white text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="px-4 py-1 border-t border-b border-neutral-300 bg-white text-neutral-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="px-3 py-1 border border-neutral-300 rounded-r-md bg-white text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
      
      {/* No Results */}
      {!isLoading && (!results || results.results.length === 0) && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-5xl mb-4 text-neutral-400">
            <i className="fas fa-search"></i>
          </div>
          <h3 className="text-xl font-medium mb-2">No recipes found</h3>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            We couldn't find any recipes matching your search criteria. Try adjusting your filters or search for something else.
          </p>
        </div>
      )}
    </div>
  );
}
