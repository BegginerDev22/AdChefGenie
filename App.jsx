import React, { useState, useEffect, useRef } from 'react';
import { ChefHatIcon, PlusIcon, SparklesIcon, XIcon, ClockIcon, HeartIcon, FilterIcon, SunIcon, MoonIcon, ShareIcon, CalendarIcon } from './components/Icons';
import { generateRecipes, generateRecipeByName } from './services/geminiService';
import { FEATURED_RECIPES } from './services/featuredRecipes';
import RecipeDetailModal from './components/RecipeDetailModal';
import MealPlanner from './components/MealPlanner';
import { generateShareText, shareRecipe, getCuisineColor } from './utils';

const COMMON_INGREDIENTS = [
  "Apples", "Asparagus", "Avocado", "Bacon", "Bananas", "Basmati Rice", "Basil", "Beans", "Beef", 
  "Bell Peppers", "Black Beans", "Bread", "Broccoli", "Brown Sugar", "Butter", "Cabbage", "Cardamom", 
  "Carrots", "Cauliflower", "Celery", "Cheddar", "Cheese", "Chicken", "Chicken Breast", "Chicken Thighs", 
  "Chickpeas", "Chili Powder", "Cilantro", "Cinnamon", "Coconut Milk", "Coriander", "Corn", "Cucumber", 
  "Cumin", "Curry Powder", "Eggs", "Fish", "Flour", "Garam Masala", "Garlic", "Ginger", "Ground Beef", 
  "Ham", "Heavy Cream", "Honey", "Lemon", "Lentils", "Lettuce", "Lime", "Milk", "Mozzarella", 
  "Mushrooms", "Mustard", "Noodles", "Oats", "Oil", "Olive Oil", "Onions", "Oregano", "Paneer", 
  "Paprika", "Parmesan", "Pasta", "Peanut Butter", "Peas", "Pepper", "Pork", "Pork Chops", "Potatoes", 
  "Quinoa", "Red Kidney Beans", "Rice", "Salmon", "Salt", "Sausage", "Shrimp", "Sour Cream", "Soy Sauce", 
  "Spaghetti", "Spinach", "Steak", "Strawberries", "Sugar", "Sweet Potatoes", "Thyme", "Tofu", "Tomatoes", 
  "Tomato Paste", "Tomato Sauce", "Tortillas", "Turmeric", "Tuna", "Turkey", "Vanilla", "Vegetable Oil", 
  "Vinegar", "Walnuts", "Yogurt", "Zucchini"
].sort();

const DIETARY_FILTERS = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "Healthy"];

const LOCAL_STORAGE_KEY = 'chefgenie_saved_recipes';
const MEAL_PLAN_KEY = 'chefgenie_meal_plan';
const THEME_STORAGE_KEY = 'chefgenie_theme';

// SEO Hard-coded recipes
const POPULAR_RECIPES = [
  {
    id: "popular-1",
    name: "Mediterranean Quinoa Bowl",
    description: "A refreshing and nutritious bowl packed with plant-based protein, fresh vegetables, and a zesty lemon-tahini dressing.",
    calories: "410 kcal",
    prepTime: "15 min",
    cookTime: "20 min",
    difficulty: "Easy",
    cuisine: "Mediterranean",
    servings: 2,
    ingredients: [
      { name: "Quinoa", amount: "1 cup cooked" },
      { name: "Chickpeas", amount: "1 can (15oz)" },
      { name: "Cucumber", amount: "1/2 cup diced" },
      { name: "Cherry Tomatoes", amount: "1/2 cup" },
      { name: "Kalamata Olives", amount: "10-12" },
      { name: "Tahini", amount: "2 tbsp" },
      { name: "Lemon Juice", amount: "1 tbsp" }
    ],
    steps: [
      "Roast chickpeas with olive oil and cumin until crunchy.",
      "Cook quinoa according to package instructions.",
      "Prep vegetables by dicing cucumber and halving tomatoes.",
      "Whisk tahini, lemon juice, and water for the dressing.",
      "Layer quinoa, veggies, and chickpeas in a bowl; drizzle with dressing."
    ],
    tags: ["Vegan", "Vegetarian", "Healthy", "Gluten-Free"],
    nutrition: { protein: "14g", carbs: "52g", fat: "18g", fiber: "12g" },
    drinkPairing: "Sparkling Water with Mint"
  },
  {
    id: "popular-2",
    name: "Spicy Leftover Pasta",
    description: "The ultimate solution for yesterday's pasta. A quick stir-fry with garlic, chili flakes, and any veggies you have on hand.",
    calories: "450 kcal",
    prepTime: "5 min",
    cookTime: "10 min",
    difficulty: "Easy",
    cuisine: "Italian-Fusion",
    servings: 1,
    ingredients: [
      { name: "Leftover Pasta", amount: "2 cups" },
      { name: "Garlic", amount: "3 cloves, minced" },
      { name: "Red Chili Flakes", amount: "1 tsp" },
      { name: "Olive Oil", amount: "2 tbsp" },
      { name: "Parmesan Cheese", amount: "1/4 cup" },
      { name: "Fresh Spinach", amount: "1 cup" }
    ],
    steps: [
      "Heat olive oil in a large skillet over medium heat.",
      "Add garlic and chili flakes, sauté for 1 minute until fragrant.",
      "Toss in the leftover pasta and spinach. Cook until spinach wilts and pasta is heated through.",
      "Remove from heat and stir in the parmesan cheese.",
      "Season with salt and pepper to taste."
    ],
    tags: ["Quick", "Lunch", "Leftovers"],
    nutrition: { protein: "12g", carbs: "65g", fat: "16g", fiber: "4g" },
    drinkPairing: "Iced Tea"
  },
  {
    id: "popular-3",
    name: "3-Ingredient Pancakes",
    description: "Fluffy, healthy, and incredibly simple. Perfect for a quick breakfast using just bananas, eggs, and a pinch of cinnamon.",
    calories: "280 kcal",
    prepTime: "5 min",
    cookTime: "10 min",
    difficulty: "Easy",
    cuisine: "American",
    servings: 1,
    ingredients: [
      { name: "Ripe Bananas", amount: "2" },
      { name: "Eggs", amount: "2 large" },
      { name: "Ground Cinnamon", amount: "1/2 tsp" }
    ],
    steps: [
      "Mash the bananas in a bowl until mostly smooth.",
      "Whisk in the eggs and cinnamon until well combined.",
      "Heat a non-stick skillet over medium heat with a little butter or oil.",
      "Pour small circles of batter onto the pan. Flip when bubbles form on the surface.",
      "Cook until golden on both sides. Serve with honey or fresh fruit."
    ],
    tags: ["Vegetarian", "Breakfast", "Gluten-Free", "Low-Carb"],
    nutrition: { protein: "14g", carbs: "48g", fat: "10g", fiber: "6g" },
    drinkPairing: "Hot Coffee"
  }
];

function App() {
  const [inputVal, setInputVal] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState(FEATURED_RECIPES);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [viewMode, setViewMode] = useState('generated');
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [showToast, setShowToast] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((r) => ({ ...r, servings: r.servings || 2 }));
    } catch (e) {
      return [];
    }
  });

  const [mealPlan, setMealPlan] = useState(() => {
    try {
        const saved = localStorage.getItem(MEAL_PLAN_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
      if (showToast) {
          const timer = setTimeout(() => setShowToast(false), 3000);
          return () => clearTimeout(timer);
      }
  }, [showToast]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputVal(val);

    if (val.trim().length > 0) {
      const valLower = val.toLowerCase();
      const filtered = COMMON_INGREDIENTS.filter(ing => 
        ing.toLowerCase().includes(valLower) && !ingredients.includes(ing)
      ).sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        if (aLower === valLower && bLower !== valLower) return -1;
        if (bLower === valLower && aLower !== valLower) return 1;
        const aStarts = aLower.startsWith(valLower);
        const bStarts = bLower.startsWith(valLower);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;
        return 0;
      });
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddIngredient = (val) => {
    const trimmed = val.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputVal('');
      setShowSuggestions(false);
      setError(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (showSuggestions && suggestions.length > 0) {
          const exactMatch = suggestions.find(s => s.toLowerCase() === inputVal.trim().toLowerCase());
          handleAddIngredient(exactMatch || (suggestions.length === 1 ? suggestions[0] : inputVal));
      } else if (inputVal.trim() && ingredients.length === 0) {
          handleGenerate();
      } else {
          handleAddIngredient(inputVal);
      }
    }
  };

  const removeIngredient = (ing) => setIngredients(ingredients.filter(i => i !== ing));

  const handleGenerate = async () => {
    if (isOffline) {
        setError("AI Generation requires an internet connection.");
        return;
    }
    const isDishSearch = ingredients.length === 0 && inputVal.trim().length > 0;
    
    if (ingredients.length === 0 && !isDishSearch) {
      setError("Please add an ingredient or dish name!");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);
    setViewMode('generated');

    try {
      const generated = isDishSearch 
        ? await generateRecipeByName(inputVal)
        : await generateRecipes(ingredients);
      setRecipes(generated);
      setHasGenerated(true);
      if (isDishSearch) setInputVal('');
    } catch (err) {
      setError("Failed to reach AI service.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipe, e) => {
    if (e) e.stopPropagation();
    const isSaved = savedRecipes.some(r => r.id === recipe.id);
    const newSavedList = isSaved ? savedRecipes.filter(r => r.id !== recipe.id) : [...savedRecipes, recipe];
    setSavedRecipes(newSavedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedList));
  };

  const handleUpdateMealPlan = (day, type, recipe) => {
      const newPlan = { ...mealPlan };
      if (!newPlan[day]) newPlan[day] = {};
      if (recipe === null) {
          if (newPlan[day]) {
            delete newPlan[day][type];
            if (Object.keys(newPlan[day]).length === 0) delete newPlan[day];
          }
      } else if (newPlan[day]) {
          newPlan[day][type] = recipe;
      }
      setMealPlan(newPlan);
      localStorage.setItem(MEAL_PLAN_KEY, JSON.stringify(newPlan));
  };

  const handleCardShare = (recipe, e) => {
      e.stopPropagation();
      const text = generateShareText(recipe);
      const imageUrl = `https://tse3.mm.bing.net/th?q=${encodeURIComponent(recipe.name + " recipe dish")}&w=800&h=600&c=7&rs=1&p=0`;
      shareRecipe(text, recipe.name, () => setShowToast(true), imageUrl);
  }

  const toggleFilter = (filter) => {
    setActiveFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };

  const getDisplayRecipes = () => {
    const sourceList = viewMode === 'generated' ? recipes : savedRecipes;
    if (activeFilters.length === 0) return sourceList;
    return sourceList.filter(recipe => {
      const recipeTags = [...recipe.tags, recipe.cuisine || ''].filter(Boolean).map(t => t.toLowerCase());
      return activeFilters.every(filter => recipeTags.includes(filter.toLowerCase()));
    });
  };

  const displayRecipes = getDisplayRecipes();
  const sourceHasRecipes = (viewMode === 'generated' ? recipes : savedRecipes).length > 0;


  // Static Pages Content
  const AboutPage = () => (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">About Us</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-6">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                ChefGenie is a personal passion project dedicated to helping home cooks make the most of their kitchen. We believe that everyone should have access to professional-grade culinary inspiration, regardless of what's currently in their pantry.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our tool leverages state-of-the-art Google Gemini AI to analyze your available ingredients and generate structured, healthy, and creative recipes. Our goal is to reduce food waste globally and help you save money by cooking with what you already own.
            </p>
            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">The Mission</p>
                <p className="text-gray-500 dark:text-gray-400">Zero waste. Infinite flavor. Powered by AI.</p>
            </div>
        </div>
    </div>
  );

  const PrivacyPage = () => (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-[fadeIn_0.5s_ease-out]">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight">Privacy Policy</h1>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl space-y-8">
            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Data Collection</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    At ChefGenie, we respect your privacy. This application is a client-side tool. We do not store any of your personal data on our servers permanently. Any ingredients you search for or recipes you save are stored exclusively on your own device using browser LocalStorage.
                </p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Cookies & Storage</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We use LocalStorage to remember your preferences, such as your saved recipes (Cookbook) and your theme (Dark/Light mode). This data never leaves your browser unless you share a recipe using the provided sharing features.
                </p>
            </section>
            <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Third Parties</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    ChefGenie uses Google's Gemini API to generate recipes. When you request a recipe, your list of ingredients is sent to Google's servers to process the request. No personally identifiable information is sent during this process.
                </p>
            </section>
        </div>
    </div>
  );

  const Footer = () => (
    <footer className={`mt-20 py-16 transition-all duration-700 ${isOffline ? 'bg-stone-100/70' : 'bg-white/50 dark:bg-gray-950/60'} backdrop-blur-xl`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center rounded-3xl border border-white/60 dark:border-gray-800/80 bg-white/70 dark:bg-gray-900/60 py-10 shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-center gap-3 mb-8 cursor-pointer" onClick={() => { setViewMode('generated'); window.scrollTo({top: 0, behavior: 'smooth'}); }}>
                <div className={`p-2.5 rounded-xl text-white transition-all duration-700 ${isOffline ? 'bg-stone-600' : 'bg-orange-600'}`}>
                    <ChefHatIcon className="w-7 h-7" />
                </div>
                <span className={`font-black text-2xl tracking-tighter ${isOffline ? 'text-stone-700' : 'text-gray-900 dark:text-white'}`}>ChefGenie</span>
            </div>
            <p className="text-sm font-medium text-gray-400 max-w-sm text-center mb-10 leading-relaxed">
                Your AI-powered culinary companion. Crafting delicious experiences from whatever you have in your kitchen.
            </p>
            <div className="flex flex-col items-center gap-6">
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                  <button onClick={() => { setViewMode('generated'); window.scrollTo(0,0); }} className={`text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'generated' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>Home</button>
                  <button onClick={() => { setViewMode('about'); window.scrollTo(0,0); }} className={`text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'about' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>About Us</button>
                  <button onClick={() => { setViewMode('privacy'); window.scrollTo(0,0); }} className={`text-xs font-black uppercase tracking-widest transition-colors ${viewMode === 'privacy' ? 'text-orange-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}>Privacy Policy</button>
                </div>
                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] mt-2">
                    © {new Date().getFullYear()} ChefGenie • Built with Google Gemini
                </p>
            </div>
        </div>
    </footer>
  );

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_10%_15%,rgba(249,115,22,0.16),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.14),transparent_35%),radial-gradient(circle_at_45%_85%,rgba(14,165,233,0.12),transparent_40%),linear-gradient(140deg,#fff8ef_0%,#ffffff_42%,#fff1dc_100%)] dark:bg-[radial-gradient(circle_at_12%_20%,rgba(249,115,22,0.22),transparent_35%),radial-gradient(circle_at_86%_10%,rgba(168,85,247,0.2),transparent_32%),linear-gradient(145deg,#020617_0%,#111827_45%,#020617_100%)] text-gray-800 dark:text-gray-100 font-sans pb-6 transition-all duration-700 ease-in-out ${isOffline ? 'grayscale-[0.2] contrast-[0.9]' : ''}`}>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animated-blob blob-1 -top-20 -left-20"></div>
        <div className="animated-blob blob-2 top-40 right-10"></div>
        <div className="animated-blob blob-3 bottom-10 left-1/2"></div>
        <div className="hero-orb absolute -top-10 right-1/4">
          <div className="pulse-ring"></div>
        </div>
      </div>
      
      {/* Non-intrusive Offline Status Banner */}
      <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 transform ease-in-out ${isOffline ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="bg-stone-800/95 dark:bg-stone-900/95 backdrop-blur-md text-stone-100 px-4 py-1.5 text-center text-[11px] font-bold flex items-center justify-center gap-3 shadow-md border-b border-stone-700">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-500"></span>
            </span>
            OFFLINE MODE
          </div>
          <span className="opacity-50 font-normal">|</span>
          <span className="font-medium">Using cached data. AI generation is currently disabled.</span>
        </div>
      </div>

      <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 flex items-center gap-2 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <SparklesIcon className="w-4 h-4 text-orange-400" />
          <span className="font-medium text-sm">Copied to clipboard!</span>
      </div>

      <nav className={`sticky top-0 z-30 px-3 sm:px-6 pt-3 transition-all duration-500 ${isOffline ? 'translate-y-8' : 'translate-y-0'}`}>
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between rounded-2xl border border-white/50 dark:border-white/10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { setViewMode('generated'); setHasGenerated(false); setRecipes(FEATURED_RECIPES); }}>
            <div className={`p-2 rounded-xl text-white transition-all duration-700 ${isOffline ? 'bg-stone-600 shadow-none' : 'bg-gradient-to-tr from-orange-500 via-amber-500 to-pink-500 shadow-lg shadow-orange-200'}`}>
              <ChefHatIcon className="w-6 h-6" />
            </div>
            <span className={`text-xl font-black transition-all duration-700 hidden sm:block tracking-tight ${isOffline ? 'text-stone-600' : 'text-gradient'}`}>
                ChefGenie
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
             <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
               {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
             </button>
             <button onClick={() => setViewMode('saved')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${viewMode === 'saved' ? (isOffline ? 'bg-stone-100 text-stone-700' : 'bg-orange-100 text-orange-600') : 'secondary-button text-gray-500 hover:text-gray-700'}`}>
                 <HeartIcon className="w-4 h-4" filled={viewMode === 'saved'} />
                 <span className="hidden sm:inline">Cookbook</span>
             </button>
             <button onClick={() => setViewMode('planner')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold transition-all duration-300 ${viewMode === 'planner' ? (isOffline ? 'bg-stone-100 text-stone-700' : 'bg-orange-100 text-orange-600') : 'secondary-button text-gray-500 hover:text-gray-700'}`}>
                 <CalendarIcon className="w-4 h-4" />
                 <span className="hidden sm:inline">Meal Plan</span>
             </button>
          </div>
        </div>
      </nav>

      <main className={`max-w-6xl mx-auto px-4 pt-8 min-h-[calc(100vh-12rem)] transition-opacity duration-700 ${isOffline ? 'opacity-90' : 'opacity-100'}`}>
        
        {viewMode === 'about' && <AboutPage />}
        {viewMode === 'privacy' && <PrivacyPage />}

        {viewMode === 'generated' && (
          <>
            <section className="mb-12 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
              <div className="glass-card shimmer-border rounded-3xl p-8 md:p-10 border border-white/60 dark:border-gray-700/70 shadow-2xl">
                <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-black tracking-widest uppercase mb-5">AI POWERED CULINARY STUDIO</p>
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.05]">
                  {isOffline ? 'Your kitchen, still ' : 'Reimagine dinner with '} 
                  <span className={`transition-colors duration-700 ${isOffline ? 'text-stone-600' : 'text-gradient'}`}>3D recipe magic.</span>
                </h1>
                <p className="mt-5 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl font-medium leading-relaxed">
                  {isOffline ? 'Browse your cookbook and meal plans while offline with the same premium layout.' : 'Turn any ingredients into restaurant-level ideas. Smart AI planning, immersive visuals, and one-click cookbook saving in a fully revamped experience.'}
                </p>
                <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    ['10k+', 'Recipes'],
                    ['60s', 'Avg. Plan Time'],
                    ['3D', 'Interactive Cards'],
                    ['Zero Waste', 'Mindset']
                  ].map(([value, label]) => (
                    <div key={label} className="rounded-2xl border border-white/70 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 px-4 py-3">
                      <p className="text-lg font-black text-gray-900 dark:text-white">{value}</p>
                      <p className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="relative rounded-3xl overflow-hidden border border-orange-100/70 dark:border-gray-700 bg-gradient-to-br from-gray-900 via-slate-900 to-black p-7 text-white shadow-2xl">
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-orange-500/30 blur-3xl"></div>
                <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-fuchsia-500/30 blur-3xl"></div>
                <div className="relative z-10 space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black tracking-[0.2em] uppercase">ChefGenie Pro UI</div>
                  <h2 className="text-2xl font-black leading-tight">Cook by mood, ingredient, or cuisine with cinematic cards.</h2>
                  <ul className="space-y-3 text-sm text-white/90 font-medium">
                    <li>• Hover cards with dynamic depth and glare response.</li>
                    <li>• Capture favorites instantly in your visual cookbook.</li>
                    <li>• Plan weekly meals with polished drag-and-browse flow.</li>
                  </ul>
                </div>
              </aside>
            </section>

            <div className={`max-w-5xl mx-auto glass-card shimmer-border rounded-3xl shadow-2xl p-6 md:p-8 mb-12 border transition-all duration-700 relative overflow-hidden ${isOffline ? 'border-stone-200 shadow-stone-100' : 'border-orange-100 dark:border-gray-700 shadow-orange-100/50'}`}>
              <div className="relative mb-6" ref={wrapperRef}>
                <input
                  type="text"
                  value={inputVal}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (inputVal.trim().length > 0) setShowSuggestions(true); }}
                  placeholder={isOffline ? "AI search is disabled" : "e.g. Garlic, Paneer, Chicken..."}
                  className={`w-full px-6 py-4 text-lg rounded-2xl border-2 transition-all duration-300 outline-none input-field ${isOffline ? 'border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed' : 'border-orange-100 dark:border-gray-700 dark:bg-gray-900 focus:border-orange-500'}`}
                  disabled={loading || isOffline}
                  autoComplete="off"
                />
                {!isOffline && (
                  <button onClick={() => handleAddIngredient(inputVal)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors" disabled={!inputVal.trim() || loading}>
                    <PlusIcon className="w-5 h-5" />
                  </button>
                )}
                {showSuggestions && suggestions.length > 0 && !isOffline && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-orange-100 dark:border-gray-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    <ul>
                      {suggestions.map((suggestion, index) => (
                        <li key={index} onMouseDown={() => handleAddIngredient(suggestion)} className="px-6 py-3.5 cursor-pointer flex items-center justify-between group hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 font-medium">
                          {suggestion} <PlusIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 text-orange-400" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-8 min-h-[44px] items-center">
                {ingredients.map((ing) => (
                  <span key={ing} className={`flex items-center gap-1.5 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-700 ${isOffline ? 'bg-stone-500' : 'pill-chip'}`}>
                    {ing} {!isOffline && <button onClick={() => removeIngredient(ing)} className="hover:bg-white/20 rounded-full p-0.5"><XIcon className="w-3.5 h-3.5" /></button>}
                  </span>
                ))}
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || isOffline || (ingredients.length === 0 && !inputVal.trim())}
                className={`w-full py-4.5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all duration-700 find-recipe-btn ${loading ? 'bg-gray-100 text-gray-400 shadow-none' : isOffline ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-2 border-dashed border-stone-200 shadow-none' : 'text-white hover:-translate-y-1 hover:scale-[1.01]'}`}
              >
                {loading ? <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" /> : isOffline ? 'Reconnect to use AI' : <><SparklesIcon className="w-6 h-6" /> Find Recipes</>}
              </button>
              {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl text-center text-xs font-bold border border-red-100">{error}</div>}
            </div>


            {!hasGenerated && (<>
            {/* SEO Information Section */}
            <div className="max-w-5xl mx-auto mb-16 p-8 glass-card shimmer-border rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm glow-card card-3d">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">How to Use ChefGenie</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    ChefGenie is your intelligent kitchen companion designed to combat global food waste. Our advanced AI tool helps you transform leftovers into gourmet meals, ensuring no ingredient goes to waste. By analyzing your available items, we provide tailored culinary solutions that are both sustainable and delicious.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="text-orange-600 dark:text-orange-500 font-black text-lg">Save Money</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Maximize your grocery budget by utilizing every bit of food you buy.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-orange-600 dark:text-orange-500 font-black text-lg">Reduce Waste</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Join the movement to lower food waste through creative leftover utilization.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-orange-600 dark:text-orange-500 font-black text-lg">Instant Recipes</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Get professionally structured recipes in seconds using Google Gemini AI.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto mb-16 grid grid-cols-1 gap-8">
                <section className="glass-card shimmer-border rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 glow-card card-3d">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-1.5 bg-orange-600 rounded-full"></span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Featured Recipe Guides</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        Discover curated guides that help you cook smarter, stretch groceries further, and build confidence in the kitchen. Each guide is packed with practical tips, flavor pairings, and step-by-step strategies you can use today.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <article className="rounded-2xl border border-orange-100 dark:border-gray-700 p-5 bg-orange-50/40 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Pantry Power Bowl Guide</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Learn how to combine grains, beans, and crisp vegetables into balanced bowls with bold sauces. Includes seasoning ratios and no-waste topping ideas.
                            </p>
                        </article>
                        <article className="rounded-2xl border border-orange-100 dark:border-gray-700 p-5 bg-orange-50/40 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Weeknight 20-Minute Dinners</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Quick meal blueprints featuring stir-fries, sheet-pan proteins, and one-pot pastas that keep flavor high and cleanup minimal.
                            </p>
                        </article>
                        <article className="rounded-2xl border border-orange-100 dark:border-gray-700 p-5 bg-orange-50/40 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">Leftover Makeover Playbook</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Transform roasted veggies, rice, and cooked proteins into fresh wraps, soups, and skillet meals with easy flavor upgrades.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="glass-card shimmer-border rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 glow-card card-3d">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-1.5 bg-orange-600 rounded-full"></span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Kitchen Strategy & Nutrition Tips</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Build a Balanced Plate</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Aim for a mix of protein, fiber-rich carbs, and colorful produce. ChefGenie’s nutrition callouts help you track protein, carbs, fats, and fiber per serving.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Smart Prep That Saves Time</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Chop vegetables, cook grains, and portion proteins once. Mix and match through the week for salads, wraps, bowls, and quick sautés.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Flavor Pairing Basics</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Balance acid (citrus, vinegar), fat (olive oil, yogurt), and spice (chili, paprika). This trio makes even simple pantry meals taste restaurant-quality.
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Reduce Food Waste</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Plan meals around ingredients you already own, freeze leftovers in single portions, and prioritize short-shelf-life produce first.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="glass-card shimmer-border rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 glow-card card-3d">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-1.5 bg-orange-600 rounded-full"></span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">ChefGenie FAQ</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">How accurate are the nutrition estimates?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Nutrition values are AI-assisted estimates based on standard ingredient data and serving sizes. For medical or dietary needs, verify with a trusted nutrition source.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">Can I search by a specific dish?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                Yes. Leave the ingredient list empty, type the dish name, and ChefGenie will generate a detailed recipe with steps, tags, and serving information.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-gray-100 dark:border-gray-700 p-5 bg-gray-50 dark:bg-gray-900/40 tilt-card card-3d">
                            <h3 className="text-base font-black text-gray-900 dark:text-white mb-2">What if I am offline?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                You can still browse your saved cookbook and meal plan. New AI generation requires an internet connection to reach the recipe service.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Popular AI Recipes Section (SEO Content) */}
            <div className="max-w-5xl mx-auto mb-16">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                    <span className="w-8 h-1.5 bg-orange-600 rounded-full"></span>
                    POPULAR AI RECIPES
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {POPULAR_RECIPES.map(recipe => (
                        <div 
                            key={recipe.id} 
                            onClick={() => setSelectedRecipe(recipe)}
                            className="card-surface premium-card rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col group tilt-card card-3d shimmer-border"
                        >
                            <div className="h-40 overflow-hidden relative">
                                <img 
                                    src={`https://tse3.mm.bing.net/th?q=${encodeURIComponent(recipe.name + " dish")}&w=400&h=300&c=7&rs=1&p=0`} 
                                    alt={recipe.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-base font-black text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{recipe.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1 mb-4">{recipe.description}</p>
                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5 text-orange-500" /> {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)}m</span>
                                    <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded">{recipe.difficulty}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            </>)}

            {(sourceHasRecipes) && (
                <div className="max-w-5xl mx-auto mb-10">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            {DIETARY_FILTERS.map(filter => (
                                <button key={filter} onClick={() => toggleFilter(filter)} className={`px-3.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all duration-300 ${activeFilters.includes(filter) ? (isOffline ? 'bg-stone-700 text-white border-stone-700' : 'bg-orange-600 text-white border-orange-600') : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-gray-300'}`}>{filter.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto space-y-12 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-black flex items-center gap-4 text-gray-900 dark:text-white uppercase tracking-wider">
                    <span className={`w-12 h-1.5 rounded-full transition-colors duration-700 ${isOffline ? 'bg-stone-300' : 'bg-orange-600'}`}></span>
                    {hasGenerated ? `Top Suggestions` : "Chef's Specials"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                {displayRecipes.map((recipe) => {
                    const isSaved = savedRecipes.some(r => r.id === recipe.id);
                    const cuisineColor = getCuisineColor(recipe.cuisine);
                    return (
                        <div
                            key={recipe.id}
                            onClick={() => setSelectedRecipe(recipe)}
                            className={`group premium-card relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer ${isOffline ? 'border-stone-100 shadow-sm' : 'border-gray-50 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2'}`}
                        >
                            <div className="h-56 overflow-hidden relative">
                                <img src={`https://tse3.mm.bing.net/th?q=${encodeURIComponent(recipe.name + " meal")}&w=800&h=600&c=7&rs=1&p=0`} alt={recipe.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ${isOffline ? 'saturate-[0.15] brightness-[0.95]' : ''}`} loading="lazy" />
                                {recipe.cuisine && <div className="absolute top-4 left-4 z-10"><span className={`px-3 py-1 rounded-lg text-[9px] font-black text-white shadow-lg border border-white/20 uppercase tracking-widest ${isOffline ? 'bg-stone-600' : cuisineColor}`}>🌍 {recipe.cuisine}</span></div>}
                                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                                    <button onClick={(e) => handleCardShare(recipe, e)} className="bg-white/95 dark:bg-gray-900/95 p-2.5 rounded-xl shadow-xl text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors"><ShareIcon className="w-5 h-5" /></button>
                                    <button onClick={(e) => toggleSaveRecipe(recipe, e)} className="bg-white/95 dark:bg-gray-900/95 p-2.5 rounded-xl shadow-xl text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"><HeartIcon className={`w-5 h-5 ${isSaved ? "text-red-500" : ""}`} filled={isSaved} /></button>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className={`text-lg font-black mb-2 line-clamp-1 transition-colors duration-700 ${isOffline ? 'text-stone-700' : 'group-hover:text-orange-600'}`}>{recipe.name}</h3>
                                <p className="text-gray-400 dark:text-gray-500 text-sm font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">{recipe.description}</p>
                                <div className={`flex items-center justify-between pt-5 border-t text-[10px] font-black tracking-widest uppercase transition-colors duration-700 ${isOffline ? 'border-stone-50 text-stone-400' : 'border-gray-50 dark:border-gray-700 text-gray-400'}`}>
                                    <div className="flex items-center gap-2">
                                    <ClockIcon className={`w-4 h-4 ${isOffline ? 'text-stone-400' : 'text-orange-500'}`} /> 
                                    {parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} MIN
                                    </div>
                                    <div className={`px-2 py-0.5 rounded ${isOffline ? 'bg-stone-50' : 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>{recipe.difficulty}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
          </>
        )}

        {viewMode === 'saved' && (
           <div className="max-w-4xl mx-auto space-y-12 animate-[fadeIn_0.5s_ease-out]">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-wider">Your Cookbook</h2>
                {savedRecipes.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center opacity-40">
                        <HeartIcon className="w-20 h-20 mb-6" />
                        <p className="text-xl font-black">NO RECIPES SAVED YET</p>
                        <button onClick={() => setViewMode('generated')} className="mt-6 px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-colors">Discover Recipes</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
                        {displayRecipes.map((recipe) => (
                             <div
                                key={recipe.id}
                                onClick={() => setSelectedRecipe(recipe)}
                                className={`group premium-card relative flex flex-col h-full bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer border-gray-50 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2`}
                             >
                                <div className="h-56 overflow-hidden relative">
                                    <img src={`https://tse3.mm.bing.net/th?q=${encodeURIComponent(recipe.name + " meal")}&w=800&h=600&c=7&rs=1&p=0`} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" loading="lazy" />
                                    <div className="absolute bottom-4 right-4 flex gap-2">
                                        <button onClick={(e) => toggleSaveRecipe(recipe, e)} className="bg-white/95 dark:bg-gray-900/95 p-2.5 rounded-xl shadow-xl text-red-500"><HeartIcon className="w-5 h-5" filled /></button>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-black mb-2 group-hover:text-orange-600 transition-colors">{recipe.name}</h3>
                                    <p className="text-gray-400 dark:text-gray-500 text-sm font-medium line-clamp-2 mb-6 flex-1 leading-relaxed">{recipe.description}</p>
                                </div>
                             </div>
                        ))}
                    </div>
                )}
           </div>
        )}

        {viewMode === 'planner' && <MealPlanner savedRecipes={savedRecipes} mealPlan={mealPlan} onUpdatePlan={handleUpdateMealPlan} onRecipeClick={setSelectedRecipe} />}

      </main>

      <Footer />

      {selectedRecipe && <RecipeDetailModal recipe={selectedRecipe} isOpen={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} isSaved={savedRecipes.some(r => r.id === selectedRecipe.id)} onToggleSave={() => toggleSaveRecipe(selectedRecipe)} onShowToast={() => setShowToast(true)} />}
    </div>
  );
}

export default App;
