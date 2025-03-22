import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  getCurrentUser, 
  getUserProfile, 
  updateUserPreferences, 
  logoutUser,
  isAuthenticated,
  User
} from "@/lib/api";

const dietOptions = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "glutenFree", label: "Gluten Free" },
  { value: "dairyFree", label: "Dairy Free" },
  { value: "ketogenic", label: "Keto" },
  { value: "paleo", label: "Paleo" },
  { value: "whole30", label: "Whole30" },
];

const cuisineOptions = [
  "African", "American", "British", "Cajun", "Caribbean", "Chinese", "Eastern European",
  "European", "French", "German", "Greek", "Indian", "Irish", "Italian", "Japanese",
  "Jewish", "Korean", "Latin American", "Mediterranean", "Mexican", "Middle Eastern",
  "Nordic", "Southern", "Spanish", "Thai", "Vietnamese"
];

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'preferences' | 'account'>('preferences');
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // User state
  const [user, setUser] = useState<User | null>(null);
  
  // Preferences state
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [ingredient, setIngredient] = useState("");
  const [favoriteIngredients, setFavoriteIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState("");
  const [favoriteCuisines, setFavoriteCuisines] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Load user profile
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUserProfile();
        setUser(profile);
        
        // Initialize preferences
        if (profile.dietPreferences) {
          setDietPreferences(profile.dietPreferences);
        }
        if (profile.favoriteIngredients) {
          setFavoriteIngredients(profile.favoriteIngredients);
        }
        if (profile.favoriteCuisines) {
          setFavoriteCuisines(profile.favoriteCuisines);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserProfile();
  }, [navigate, toast]);
  
  const handleDietChange = (diet: string, checked: boolean) => {
    if (checked) {
      setDietPreferences([...dietPreferences, diet]);
    } else {
      setDietPreferences(dietPreferences.filter(d => d !== diet));
    }
  };
  
  const addIngredient = () => {
    if (ingredient && !favoriteIngredients.includes(ingredient)) {
      setFavoriteIngredients([...favoriteIngredients, ingredient]);
      setIngredient("");
    }
  };
  
  const removeIngredient = (ingredient: string) => {
    setFavoriteIngredients(favoriteIngredients.filter(i => i !== ingredient));
  };
  
  const addCuisine = () => {
    if (cuisine && !favoriteCuisines.includes(cuisine)) {
      setFavoriteCuisines([...favoriteCuisines, cuisine]);
      setCuisine("");
    }
  };
  
  const removeCuisine = (cuisine: string) => {
    setFavoriteCuisines(favoriteCuisines.filter(c => c !== cuisine));
  };
  
  const handleLogout = () => {
    logoutUser();
    navigate('/');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const handleSavePreferences = async () => {
    try {
      setUpdateLoading(true);
      
      await updateUserPreferences({
        dietPreferences,
        favoriteIngredients,
        favoriteCuisines
      });
      
      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };
  
  if (loading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="flex-grow container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-600 mt-1">Customize your recipe preferences</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="bg-white hover:bg-gray-100 border-gray-200"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'preferences' | 'account')} className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md">
                <TabsTrigger value="preferences" className="font-medium">
                  <i className="fas fa-sliders-h mr-2"></i>
                  Preferences
                </TabsTrigger>
                <TabsTrigger value="account" className="font-medium">
                  <i className="fas fa-user mr-2"></i>
                  Account
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-6">
              <TabsContent value="preferences" className="space-y-8 mt-0">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Diet Preferences</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Select any dietary restrictions or preferences. We'll use these to recommend recipes for you.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dietOptions.map((diet) => (
                      <div key={diet.value} className="flex items-center space-x-2">
                        <Checkbox 
                          id={diet.value} 
                          checked={dietPreferences.includes(diet.value)}
                          onCheckedChange={(checked) => handleDietChange(diet.value, checked as boolean)}
                        />
                        <Label htmlFor={diet.value} className="cursor-pointer">{diet.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Favorite Ingredients</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Add ingredients you love. We'll prioritize recipes that include these ingredients.
                  </p>
                  
                  <div className="flex space-x-2 mb-4">
                    <Input 
                      value={ingredient}
                      onChange={(e) => setIngredient(e.target.value)}
                      placeholder="Enter an ingredient (e.g. chicken, spinach)"
                      className="flex-grow"
                      onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                    />
                    <Button 
                      type="button" 
                      onClick={addIngredient}
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      <i className="fas fa-plus mr-1"></i>
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {favoriteIngredients.map((item) => (
                      <Badge key={item} variant="secondary" className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeIngredient(item)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </Badge>
                    ))}
                    {favoriteIngredients.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No favorite ingredients added yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Favorite Cuisines</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    Select cuisines you enjoy. We'll suggest more recipes from these cuisines.
                  </p>
                  
                  <div className="flex space-x-2 mb-4">
                    <select
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a cuisine</option>
                      {cuisineOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <Button 
                      type="button" 
                      onClick={addCuisine}
                      variant="outline"
                      className="flex-shrink-0"
                      disabled={!cuisine}
                    >
                      <i className="fas fa-plus mr-1"></i>
                      Add
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {favoriteCuisines.map((item) => (
                      <Badge key={item} variant="secondary" className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200">
                        {item}
                        <button
                          type="button"
                          onClick={() => removeCuisine(item)}
                          className="ml-2 text-orange-600 hover:text-orange-800"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </Badge>
                    ))}
                    {favoriteCuisines.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No favorite cuisines added yet</p>
                    )}
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button 
                    onClick={handleSavePreferences}
                    className="bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-500 text-white py-2 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-1px]"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="account" className="mt-0">
                <Card className="border-0 shadow-none">
                  <div className="space-y-8">
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                      <div className="h-32 w-32 rounded-full bg-gradient-to-r from-primary to-orange-400 flex items-center justify-center text-white text-5xl shadow-md">
                        {user?.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt={user.name} 
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={user?.name || ''} disabled className="bg-gray-50" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={user?.email || ''} disabled className="bg-gray-50" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value="••••••••" disabled className="bg-gray-50" />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </main>
  );
}