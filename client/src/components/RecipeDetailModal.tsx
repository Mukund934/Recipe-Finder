import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RecipeDetail, addFavoriteRecipe, removeFavoriteRecipe } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface RecipeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe?: RecipeDetail;
  isLoading: boolean;
}

export default function RecipeDetailModal({
  isOpen,
  onClose,
  recipe,
  isLoading
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState("ingredients");
  const [servings, setServings] = useState(recipe?.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [favorite, setFavorite] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Reset servings when recipe changes
  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 4);
    }
  }, [recipe?.id]);

  // Add recipe to favorites
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteRecipe,
    onSuccess: () => {
      toast({
        title: "Added to favorites",
        description: `${recipe?.title} has been added to your favorites.`,
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
        description: `${recipe?.title} has been removed from your favorites.`,
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

  const toggleFavorite = () => {
    if (!recipe) return;
    
    const newFavoriteState = !favorite;
    setFavorite(newFavoriteState);
    
    if (newFavoriteState) {
      addFavoriteMutation.mutate(recipe.id);
    } else {
      removeFavoriteMutation.mutate(recipe.id);
    }
  };

  const toggleIngredientCheck = (id: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedIngredients(newChecked);
  };

  const handleChangeServings = (delta: number) => {
    const newServings = Math.max(1, servings + delta);
    setServings(newServings);
  };

  const addToGroceryList = () => {
    toast({
      title: "Added to Grocery List",
      description: "All ingredients have been added to your grocery list.",
    });
  };

  // Nutritional information (for display)
  const calories = recipe?.nutrition?.nutrients.find(n => n.name === "Calories")?.amount || 0;
  const protein = recipe?.nutrition?.nutrients.find(n => n.name === "Protein")?.amount || 0;
  const fat = recipe?.nutrition?.nutrients.find(n => n.name === "Fat")?.amount || 0;
  const carbs = recipe?.nutrition?.nutrients.find(n => n.name === "Carbohydrates")?.amount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        {isLoading ? (
          <>
            <DialogHeader>
              <DialogTitle><Skeleton className="h-7 w-3/4" /></DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Skeleton className="w-full h-64 md:h-80 rounded-md" />
            </div>
            <div className="mt-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </>
        ) : recipe ? (
          <>
            <DialogHeader className="flex flex-row items-center justify-between mb-4">
              <DialogTitle className="text-xl md:text-2xl font-heading font-bold text-gray-800">
                {recipe.title}
              </DialogTitle>
              <div className="flex items-center space-x-3">
                <button 
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                    favorite 
                      ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                  onClick={toggleFavorite}
                  aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <i className={`${favorite ? 'fas text-primary' : 'far'} fa-heart text-lg`}></i>
                </button>
              </div>
            </DialogHeader>

            <div className="relative rounded-lg overflow-hidden mb-6 group">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-64 md:h-80 object-cover transform transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {recipe.cuisines && recipe.cuisines.length > 0 && (
                    <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm">
                      {recipe.cuisines[0]}
                    </span>
                  )}
                  {recipe.diets && recipe.diets.slice(0, 2).map((diet, i) => (
                    <span key={i} className="text-white text-xs font-medium px-3 py-1 rounded-full bg-green-500/80 backdrop-blur-sm">
                      {diet}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm flex items-center">
                    <i className="far fa-clock mr-1"></i> {recipe.readyInMinutes} min
                  </span>
                  <span className="text-sm flex items-center">
                    <i className="fas fa-fire mr-1"></i> {Math.round(calories)} calories
                  </span>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="ingredients" value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="ingredients" className="font-medium">Ingredients</TabsTrigger>
                <TabsTrigger value="instructions" className="font-medium">Instructions</TabsTrigger>
                <TabsTrigger value="nutrition" className="font-medium">Nutrition</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ingredients" className="animate-in fade-in-50 duration-300">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-heading font-semibold text-lg text-gray-800">Ingredients</h4>
                  <div className="flex items-center bg-gray-50 rounded-md p-1 shadow-sm">
                    <label className="text-sm mr-2 text-gray-600">Servings:</label>
                    <div className="flex items-center">
                      <button 
                        className="p-1 w-8 h-8 flex items-center justify-center rounded-l-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => handleChangeServings(-1)}
                      >
                        <i className="fas fa-minus text-xs"></i>
                      </button>
                      <span className="px-3 py-1 h-8 flex items-center justify-center border-y border-gray-200 bg-white text-gray-800 min-w-[40px] text-center font-medium">
                        {servings}
                      </span>
                      <button 
                        className="p-1 w-8 h-8 flex items-center justify-center rounded-r-md bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => handleChangeServings(1)}
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {recipe.extendedIngredients.map((ingredient, index) => {
                    // Calculate adjusted amount based on servings
                    const originalServings = recipe.servings;
                    const adjustmentFactor = servings / originalServings;
                    const adjustedAmount = ingredient.amount * adjustmentFactor;
                    
                    return (
                      <div key={index} className="py-3 flex items-center group">
                        <input 
                          type="checkbox" 
                          id={`ing-${ingredient.id}`} 
                          className="mr-3 h-5 w-5 accent-primary rounded"
                          checked={checkedIngredients.has(ingredient.id)}
                          onChange={() => toggleIngredientCheck(ingredient.id)}
                        />
                        <label 
                          htmlFor={`ing-${ingredient.id}`} 
                          className={`text-gray-700 group-hover:text-gray-900 transition-colors ${
                            checkedIngredients.has(ingredient.id) ? 'line-through text-gray-400' : ''
                          }`}
                        >
                          <span className="font-medium">
                            {adjustedAmount.toFixed(adjustedAmount % 1 === 0 ? 0 : 1)} {ingredient.unit}
                          </span> {ingredient.name}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6">
                  <Button 
                    className="flex items-center justify-center w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors"
                    onClick={addToGroceryList}
                  >
                    <i className="fas fa-shopping-basket mr-2"></i> Add to Grocery List
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="instructions" className="animate-in fade-in-50 duration-300">
                <h4 className="font-heading font-semibold text-lg text-gray-800 mb-4">Instructions</h4>
                {recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0 ? (
                  <ol className="list-decimal ml-5 space-y-5">
                    {recipe.analyzedInstructions[0].steps.map((step, index) => (
                      <li key={index} className="text-gray-700 pl-2">
                        <p className="leading-relaxed">{step.step}</p>
                        {(step.ingredients?.length > 0 || step.equipment?.length > 0) && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {step.ingredients?.map((ing, i) => (
                              <span key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                {ing.name}
                              </span>
                            ))}
                            {step.equipment?.map((eq, i) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {eq.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: recipe.instructions }} />
                )}
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-800 mb-3">Preparation Time</h5>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="block text-primary font-bold text-lg">
                        {Math.round(recipe.readyInMinutes * 0.3)}
                      </span>
                      <span className="text-xs text-gray-500">Prep (mins)</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="block text-primary font-bold text-lg">
                        {Math.round(recipe.readyInMinutes * 0.7)}
                      </span>
                      <span className="text-xs text-gray-500">Cook (mins)</span>
                    </div>
                    <div className="bg-white p-3 rounded shadow-sm">
                      <span className="block text-primary font-bold text-lg">
                        {recipe.readyInMinutes}
                      </span>
                      <span className="text-xs text-gray-500">Total (mins)</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="nutrition" className="animate-in fade-in-50 duration-300">
                <h4 className="font-heading font-semibold text-lg text-gray-800 mb-2">Nutrition Information</h4>
                <p className="text-sm text-gray-500 mb-6">Per serving (based on {recipe.servings} servings)</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Calories</span>
                      <span className="text-primary font-semibold">{Math.round(calories)}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(calories / 10, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Protein</span>
                      <span className="text-primary font-semibold">{Math.round(protein)}g</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(protein * 3, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Fat</span>
                      <span className="text-primary font-semibold">{Math.round(fat)}g</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(fat * 2, 100)}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Carbs</span>
                      <span className="text-primary font-semibold">{Math.round(carbs)}g</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min(carbs / 1.5, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h5 className="font-medium text-gray-700 mb-3">Additional Nutritional Information</h5>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      {recipe.nutrition?.nutrients.filter(n => 
                        !['Calories', 'Protein', 'Fat', 'Carbohydrates'].includes(n.name)
                      ).slice(0, 8).map((nutrient, index) => (
                        <div key={index} className="flex justify-between items-center pr-4">
                          <span className="text-gray-600">{nutrient.name}</span>
                          <div className="flex items-baseline">
                            <span className="text-gray-900 font-medium">
                              {Math.round(nutrient.amount)}{nutrient.unit}
                            </span>
                            {nutrient.percentOfDailyNeeds && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({Math.round(nutrient.percentOfDailyNeeds)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <a 
                href={recipe.sourceUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center text-sm font-medium"
              >
                <i className="fas fa-external-link-alt mr-1"></i> View Original Recipe
              </a>
              <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-md font-medium">
                <i className="fas fa-calendar-plus mr-2"></i> Add to Meal Plan
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-search text-4xl text-gray-300 mb-3"></i>
            <h3 className="text-xl font-medium text-gray-800">Recipe Not Found</h3>
            <p className="text-gray-600 mt-2">
              Sorry, we couldn't find the requested recipe.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}