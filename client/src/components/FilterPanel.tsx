import { useState, KeyboardEvent, ChangeEvent } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Diet } from "@/lib/api";

interface FilterPanelProps {
  activeDiets: Diet[];
  activeCuisine: string;
  activeTime: number;
  activeIngredients: string[];
  onFilterChange: (diets: Diet[], cuisine: string, time: number, ingredients: string[]) => void;
}

export default function FilterPanel({
  activeDiets,
  activeCuisine,
  activeTime,
  activeIngredients,
  onFilterChange
}: FilterPanelProps) {
  const [diets, setDiets] = useState<Diet[]>(activeDiets);
  const [cuisine, setCuisine] = useState(activeCuisine);
  const [maxTime, setMaxTime] = useState(activeTime);
  const [ingredients, setIngredients] = useState<string[]>(activeIngredients);
  const [newIngredient, setNewIngredient] = useState("");

  // Diet filter handlers
  const handleDietChange = (diet: Diet, checked: boolean) => {
    let updatedDiets;
    if (checked) {
      updatedDiets = [...diets, diet];
    } else {
      updatedDiets = diets.filter(d => d !== diet);
    }
    setDiets(updatedDiets);
    onFilterChange(updatedDiets, cuisine, maxTime, ingredients);
  };

  // Cuisine filter handler
  const handleCuisineChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCuisine(e.target.value);
    onFilterChange(diets, e.target.value, maxTime, ingredients);
  };

  // Time filter handler
  const handleTimeChange = (value: number[]) => {
    setMaxTime(value[0]);
    onFilterChange(diets, cuisine, value[0], ingredients);
  };

  // Ingredient filter handlers
  const handleAddIngredient = () => {
    if (newIngredient.trim() && !ingredients.includes(newIngredient.trim())) {
      const updatedIngredients = [...ingredients, newIngredient.trim()];
      setIngredients(updatedIngredients);
      setNewIngredient("");
      onFilterChange(diets, cuisine, maxTime, updatedIngredients);
    }
  };

  const handleIngredientKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    const updatedIngredients = ingredients.filter(i => i !== ingredient);
    setIngredients(updatedIngredients);
    onFilterChange(diets, cuisine, maxTime, updatedIngredients);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setDiets([]);
    setCuisine("");
    setMaxTime(30);
    setIngredients([]);
    setNewIngredient("");
    onFilterChange([], "", 30, []);
  };

  return (
    <aside className="w-full md:w-64 bg-white rounded-xl shadow-md h-fit sticky top-20 animate-fade-in overflow-hidden">
      <div className="bg-gradient-to-r from-primary/90 to-orange-400 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Refine Your Search</h3>
          <button 
            className="text-white/90 text-sm hover:text-white transition-colors flex items-center"
            onClick={handleResetFilters}
            aria-label="Clear all filters"
          >
            <i className="fas fa-redo-alt mr-1.5"></i>
            Reset
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {/* Diet Restrictions Filter */}
        <div className="mb-7">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <i className="fas fa-utensils text-primary mr-2"></i>
            Dietary Preferences
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center group">
              <Checkbox 
                id="diet-vegetarian" 
                checked={diets.includes("vegetarian")}
                onCheckedChange={(checked) => handleDietChange("vegetarian", checked as boolean)}
                className="mr-2.5 h-4 w-4 text-primary border-gray-300 rounded group-hover:border-primary transition-colors"
              />
              <Label htmlFor="diet-vegetarian" className="text-sm text-gray-700 group-hover:text-gray-900 cursor-pointer transition-colors">Vegetarian</Label>
            </div>
            <div className="flex items-center group">
              <Checkbox 
                id="diet-vegan" 
                checked={diets.includes("vegan")}
                onCheckedChange={(checked) => handleDietChange("vegan", checked as boolean)}
                className="mr-2.5 h-4 w-4 text-primary border-gray-300 rounded group-hover:border-primary transition-colors"
              />
              <Label htmlFor="diet-vegan" className="text-sm text-gray-700 group-hover:text-gray-900 cursor-pointer transition-colors">Vegan</Label>
            </div>
            <div className="flex items-center group">
              <Checkbox 
                id="diet-glutenFree" 
                checked={diets.includes("glutenFree")}
                onCheckedChange={(checked) => handleDietChange("glutenFree", checked as boolean)}
                className="mr-2.5 h-4 w-4 text-primary border-gray-300 rounded group-hover:border-primary transition-colors"
              />
              <Label htmlFor="diet-glutenFree" className="text-sm text-gray-700 group-hover:text-gray-900 cursor-pointer transition-colors">Gluten Free</Label>
            </div>
            <div className="flex items-center group">
              <Checkbox 
                id="diet-dairyFree" 
                checked={diets.includes("dairyFree")}
                onCheckedChange={(checked) => handleDietChange("dairyFree", checked as boolean)}
                className="mr-2.5 h-4 w-4 text-primary border-gray-300 rounded group-hover:border-primary transition-colors"
              />
              <Label htmlFor="diet-dairyFree" className="text-sm text-gray-700 group-hover:text-gray-900 cursor-pointer transition-colors">Dairy Free</Label>
            </div>
          </div>
        </div>
        
        {/* Cuisine Filter */}
        <div className="mb-7">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <i className="fas fa-globe-americas text-primary mr-2"></i>
            Cuisine Type
          </h4>
          <select 
            className="w-full p-2.5 border border-gray-200 rounded-lg text-sm shadow-sm modern-input focus:border-primary/30"
            value={cuisine}
            onChange={handleCuisineChange}
          >
            <option value="">All Cuisines</option>
            <option value="italian">Italian</option>
            <option value="mexican">Mexican</option>
            <option value="asian">Asian</option>
            <option value="mediterranean">Mediterranean</option>
            <option value="american">American</option>
            <option value="indian">Indian</option>
            <option value="french">French</option>
            <option value="thai">Thai</option>
            <option value="japanese">Japanese</option>
            <option value="chinese">Chinese</option>
          </select>
        </div>
        
        {/* Cooking Time Filter */}
        <div className="mb-7">
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <i className="fas fa-clock text-primary mr-2"></i>
            Max Cooking Time
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs text-gray-500">15 min</span>
              <span className="text-xs text-gray-500">60+ min</span>
            </div>
            <Slider
              defaultValue={[maxTime]}
              value={[maxTime]}
              min={15}
              max={60}
              step={1}
              onValueChange={handleTimeChange}
              className="w-full accent-primary"
            />
            <div className="text-center">
              <span className="inline-block px-3 py-1 bg-orange-50 text-primary rounded-full text-sm font-medium">
                {maxTime} minutes or less
              </span>
            </div>
          </div>
        </div>
        
        {/* Ingredients Includer */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
            <i className="fas fa-carrot text-primary mr-2"></i>
            Must Include Ingredients
          </h4>
          <div className="flex items-center mb-3">
            <Input 
              type="text" 
              placeholder="Type an ingredient..." 
              className="modern-input w-full p-2.5 text-sm"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyPress={handleIngredientKeyPress}
            />
            <Button 
              className="ml-2 bg-primary hover:bg-primary/90 text-white p-2 rounded-md transition-colors"
              onClick={handleAddIngredient}
              aria-label="Add ingredient"
              disabled={!newIngredient.trim()}
            >
              <i className="fas fa-plus"></i>
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span 
                key={index} 
                className="badge-primary inline-flex items-center text-sm transition-all hover:pr-1"
              >
                {ingredient}
                <button 
                  className="ml-1.5 text-orange-700 hover:text-orange-900 p-0.5 rounded-full hover:bg-orange-100 transition-colors"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  aria-label={`Remove ${ingredient}`}
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </span>
            ))}
            {ingredients.length === 0 && (
              <p className="text-sm text-gray-500 italic">No ingredients added yet</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
