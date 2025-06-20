import axios from "axios";

const API_KEY =
	import.meta.env.VITE_SPOONACULAR_API_KEY ||
	"220280c3f65e4ac3b7c96bd8b98e0026";
const BASE_URL = "https://api.spoonacular.com";

const getApiUrl = () => {
	return "/api";
};

const spoonacularApi = axios.create({
	baseURL: BASE_URL,
});

const backendApi = axios.create({
	baseURL: getApiUrl(),
});

const getToken = () => localStorage.getItem("recipe_finder_token");

backendApi.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Types and Interfaces
export type Diet = "vegetarian" | "vegan" | "glutenFree" | "dairyFree";
export type SortOption = "popularity" | "time" | "relevance";

export interface UserPreferences {
	dietPreferences?: string[];
	favoriteIngredients?: string[];
	favoriteCuisines?: string[];
}

export interface User {
	id: string;
	name: string;
	email: string;
	dietPreferences?: string[];
	favoriteIngredients?: string[];
	favoriteCuisines?: string[];
	profilePicture?: string;
}

export interface AuthResponse {
	message: string;
	token: string;
	user: User;
}

export interface SearchParams {
	query?: string;
	diet?: Diet[];
	cuisine?: string;
	maxReadyTime?: number;
	includeIngredients?: string[];
	sort?: SortOption;
	offset?: number;
	number?: number;
}

export interface RecipeSummary {
	id: number;
	title: string;
	image: string;
	imageType: string;
	readyInMinutes: number;
	servings: number;
	sourceUrl: string;
	diets?: string[];
	dishTypes?: string[];
	cuisines?: string[];
	extendedIngredients?: {
		id: number;
		name: string;
		amount: number;
		unit: string;
	}[];
	nutrition?: {
		nutrients: {
			name: string;
			amount: number;
			unit: string;
			percentOfDailyNeeds?: number;
		}[];
	};
}

export interface RecipeDetail extends RecipeSummary {
	dishTypes: string[];
	diets: string[];
	cuisines: string[];
	summary: string;
	instructions: string;
	analyzedInstructions: {
		name: string;
		steps: {
			number: number;
			step: string;
			ingredients: {
				id: number;
				name: string;
				localizedName: string;
				image: string;
			}[];
			equipment: {
				id: number;
				name: string;
				localizedName: string;
				image: string;
			}[];
		}[];
	}[];
	extendedIngredients: {
		id: number;
		aisle: string;
		image: string;
		consistency: string;
		name: string;
		nameClean: string;
		original: string;
		originalName: string;
		amount: number;
		unit: string;
		meta: string[];
		measures: {
			us: {
				amount: number;
				unitShort: string;
				unitLong: string;
			};
			metric: {
				amount: number;
				unitShort: string;
				unitLong: string;
			};
		};
	}[];
}

export interface SearchResponse {
	results: RecipeSummary[];
	offset: number;
	number: number;
	totalResults: number;
}

// Auth functions
export const registerUser = async (
	name: string,
	email: string,
	password: string
): Promise<{ message: string }> => {
	try {
		const response = await backendApi.post("/auth/register", {
			name,
			email,
			password,
		});
		return response.data;
	} catch (error) {
		console.error("Registration error:", error);
		throw error;
	}
};

export const loginUser = async (
	email: string,
	password: string
): Promise<AuthResponse> => {
	try {
		const response = await backendApi.post("/auth/login", {
			email,
			password,
		});
		if (response.data.token) {
			localStorage.setItem("recipe_finder_token", response.data.token);
			localStorage.setItem(
				"recipe_finder_user",
				JSON.stringify(response.data.user)
			);
		}
		return response.data;
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
};

export const logoutUser = (): void => {
	localStorage.removeItem("recipe_finder_token");
	localStorage.removeItem("recipe_finder_user");
};

export const getCurrentUser = (): User | null => {
	const userJson = localStorage.getItem("recipe_finder_user");
	return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = (): boolean => {
	return !!getToken();
};

export const getUserProfile = async (): Promise<User> => {
	try {
		const response = await backendApi.get("/user/profile");
		return response.data;
	} catch (error) {
		console.error("Error fetching user profile:", error);
		throw error;
	}
};

export const updateUserPreferences = async (
	preferences: UserPreferences
): Promise<User> => {
	try {
		const response = await backendApi.patch("/user/preferences", preferences);
		const currentUser = getCurrentUser();
		if (currentUser) {
			const updatedUser = { ...currentUser, ...preferences };
			localStorage.setItem(
				"recipe_finder_user",
				JSON.stringify(updatedUser)
			);
		}
		return response.data;
	} catch (error) {
		console.error("Error updating user preferences:", error);
		throw error;
	}
};

// Recipe search
export const searchRecipes = async (
	params: SearchParams
): Promise<SearchResponse> => {
	try {
		const currentUser = getCurrentUser();
		let enhancedParams = { ...params };

		if (currentUser) {
			if (currentUser.dietPreferences?.length && !params.diet?.length) {
				enhancedParams.diet = currentUser.dietPreferences as Diet[];
			}
			if (currentUser.favoriteCuisines?.length && !params.cuisine) {
				enhancedParams.cuisine = currentUser.favoriteCuisines[0];
			}
			if (
				currentUser.favoriteIngredients?.length &&
				!params.includeIngredients?.length
			) {
				enhancedParams.includeIngredients =
					currentUser.favoriteIngredients.slice(0, 3);
			}
		}

		enhancedParams.sort =
			enhancedParams.diet ||
			enhancedParams.cuisine ||
			enhancedParams.includeIngredients
				? "relevance"
				: "popularity";

		const response = await spoonacularApi.get(`/recipes/complexSearch`, {
			params: {
				apiKey: API_KEY,
				addRecipeNutrition: true,
				query: enhancedParams.query || "",
				diet: enhancedParams.diet?.join(","),
				cuisine: enhancedParams.cuisine,
				maxReadyTime: enhancedParams.maxReadyTime,
				includeIngredients:
					enhancedParams.includeIngredients?.join(","),
				sort:
					enhancedParams.sort === "relevance"
						? undefined
						: enhancedParams.sort,
				offset: enhancedParams.offset || 0,
				number: enhancedParams.number || 10,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error searching recipes:", error);
		throw error;
	}
};

export const getRecipeDetails = async (id: number): Promise<RecipeDetail> => {
	try {
		const response = await spoonacularApi.get(`/recipes/${id}/information`, {
			params: {
				apiKey: API_KEY,
				includeNutrition: true,
			},
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching recipe details:", error);
		throw error;
	}
};

export const getRecommendedRecipes = async (): Promise<SearchResponse> => {
	try {
		const currentUser = getCurrentUser();
		const params: SearchParams = { number: 10 };

		if (currentUser) {
			if (currentUser.dietPreferences?.length) {
				params.diet = currentUser.dietPreferences as Diet[];
			}
			if (currentUser.favoriteCuisines?.length) {
				params.cuisine = currentUser.favoriteCuisines[0];
			}
			if (currentUser.favoriteIngredients?.length) {
				params.includeIngredients =
					currentUser.favoriteIngredients.slice(0, 3);
			}
		}

		params.sort =
			params.diet || params.cuisine || params.includeIngredients
				? "relevance"
				: "popularity";

		return await searchRecipes(params);
	} catch (error) {
		console.error("Error getting recommended recipes:", error);
		throw error;
	}
};

export const addFavoriteRecipe = async (recipeId: number): Promise<void> => {
	await backendApi.post("/favorites", { recipeId });
};

export const removeFavoriteRecipe = async (
	recipeId: number
): Promise<void> => {
	await backendApi.delete(`/favorites/${recipeId}`);
};

export const getFavoriteRecipes = async (): Promise<number[]> => {
	const response = await backendApi.get("/favorites");
	return response.data;
};
