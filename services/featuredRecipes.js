export const FEATURED_RECIPES = [
  {
    id: "featured-1",
    name: "Classic Paneer Butter Masala",
    description: "A rich and creamy Indian curry made with soft paneer cubes in a tomato-based gravy, flavored with aromatic spices and a touch of cream.",
    calories: "380 kcal",
    prepTime: "15 min",
    cookTime: "25 min",
    difficulty: "Medium",
    cuisine: "Indian",
    servings: 4,
    ingredients: [
      { name: "Paneer", amount: "250g" },
      { name: "Tomatoes", amount: "4 medium" },
      { name: "Onion", amount: "1 large" },
      { name: "Heavy Cream", amount: "2 tbsp" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Ginger Garlic Paste", amount: "1 tbsp" },
      { name: "Garam Masala", amount: "1 tsp" }
    ],
    steps: [
      "Sauté onions and ginger-garlic paste until golden.",
      "Add tomato puree and cook until the oil separates.",
      "Add spices and salt, followed by paneer cubes.",
      "Stir in cream and butter for that signature rich texture.",
      "Garnish with fresh cilantro and serve hot."
    ],
    tags: ["Vegetarian", "Dinner", "Healthy"],
    nutrition: {
      protein: "18g",
      carbs: "12g",
      fat: "28g",
      fiber: "3g"
    },
    drinkPairing: "Mango Lassi or a crisp Lager"
  },
  {
    id: "featured-2",
    name: "Authentic Spaghetti Carbonara",
    description: "The Roman classic using just four main ingredients: eggs, pecorino cheese, guanciale, and black pepper.",
    calories: "520 kcal",
    prepTime: "10 min",
    cookTime: "15 min",
    difficulty: "Medium",
    cuisine: "Italian",
    servings: 2,
    ingredients: [
      { name: "Spaghetti", amount: "200g" },
      { name: "Eggs", amount: "2 whole + 1 yolk" },
      { name: "Pecorino Romano", amount: "50g" },
      { name: "Guanciale or Pancetta", amount: "100g" },
      { name: "Black Pepper", amount: "To taste" }
    ],
    steps: [
      "Boil spaghetti in salted water until al dente.",
      "Whisk eggs and grated cheese in a bowl.",
      "Crisp the guanciale in a pan until the fat renders.",
      "Toss pasta into the pan with meat, remove from heat, and quickly stir in egg mixture.",
      "Use pasta water to emulsify into a silky sauce."
    ],
    tags: ["Dinner", "Quick"],
    nutrition: {
      protein: "24g",
      carbs: "62g",
      fat: "18g",
      fiber: "2g"
    },
    drinkPairing: "Pinot Grigio or Soave"
  },
  {
    id: "featured-3",
    name: "Golden Kung Pao Chicken",
    description: "A spicy, stir-fried Chinese dish made with cubes of chicken, peanuts, vegetables, and chili peppers.",
    calories: "450 kcal",
    prepTime: "20 min",
    cookTime: "10 min",
    difficulty: "Medium",
    cuisine: "Chinese",
    servings: 3,
    ingredients: [
      { name: "Chicken Breast", amount: "400g" },
      { name: "Peanuts", amount: "1/2 cup" },
      { name: "Soy Sauce", amount: "2 tbsp" },
      { name: "Dried Red Chilies", amount: "6-8" },
      { name: "Bell Peppers", amount: "2 medium" },
      { name: "Hoisin Sauce", amount: "1 tbsp" }
    ],
    steps: [
      "Marinate chicken in soy sauce and cornstarch.",
      "Stir-fry chicken until browned and set aside.",
      "Sauté chilies, ginger, and garlic, then add bell peppers.",
      "Add chicken back with hoisin sauce and peanuts.",
      "Toss until everything is coated in a glossy sauce."
    ],
    tags: ["Dinner", "Spicy", "High-Protein"],
    nutrition: {
      protein: "35g",
      carbs: "15g",
      fat: "25g",
      fiber: "4g"
    },
    drinkPairing: "Riesling or a light Pale Ale"
  },
  {
    id: "featured-4",
    name: "Street Style Beef Tacos",
    description: "Simple, flavorful Mexican street tacos with seasoned ground beef, fresh onions, cilantro, and a squeeze of lime on warm corn tortillas.",
    calories: "320 kcal",
    prepTime: "10 min",
    cookTime: "15 min",
    difficulty: "Easy",
    cuisine: "Mexican",
    servings: 2,
    ingredients: [
      { name: "Ground Beef", amount: "300g" },
      { name: "Corn Tortillas", amount: "6 small" },
      { name: "Onion", amount: "1/2 cup diced" },
      { name: "Cilantro", amount: "1/4 cup" },
      { name: "Lime", amount: "2 wedges" },
      { name: "Taco Seasoning", amount: "2 tbsp" }
    ],
    steps: [
      "Brown the beef in a skillet over medium heat.",
      "Add taco seasoning and a splash of water, simmer for 5 mins.",
      "Warm tortillas on a flat griddle.",
      "Assemble by placing beef on tortillas, topped with onions and cilantro.",
      "Serve immediately with lime wedges."
    ],
    tags: ["Quick", "Lunch", "Gluten-Free"],
    nutrition: {
      protein: "22g",
      carbs: "24g",
      fat: "14g",
      fiber: "5g"
    },
    drinkPairing: "Mexican Lager or Hibiscus Tea"
  },
  {
    id: "featured-5",
    name: "Miso Glazed Atlantic Salmon",
    description: "Buttery salmon fillets marinated in a sweet and savory white miso glaze, broiled to perfection with a caramelized exterior.",
    calories: "420 kcal",
    prepTime: "10 min",
    cookTime: "12 min",
    difficulty: "Easy",
    cuisine: "Japanese",
    servings: 2,
    ingredients: [
      { name: "Salmon Fillets", amount: "2 (6oz each)" },
      { name: "White Miso Paste", amount: "2 tbsp" },
      { name: "Mirin", amount: "1 tbsp" },
      { name: "Sake or Dry White Wine", amount: "1 tbsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Green Onions", amount: "1 stalk" }
    ],
    steps: [
      "Whisk miso, mirin, sake, and sugar in a small bowl until smooth.",
      "Coat salmon fillets generously with the glaze.",
      "Let marinate for at least 30 mins (optional, for deeper flavor).",
      "Broil on high for 10-12 mins until the glaze is bubbly and browned.",
      "Garnish with sliced green onions and serve with rice."
    ],
    tags: ["High-Protein", "Healthy", "Dinner", "Gluten-Free"],
    nutrition: {
      protein: "34g",
      carbs: "12g",
      fat: "24g",
      fiber: "1g"
    },
    drinkPairing: "Junmai Sake or a dry Rosé"
  },
  {
    id: "featured-6",
    name: "Authentic Shrimp Pad Thai",
    description: "The quintessential Thai street food: stir-fried rice noodles with juicy shrimp, tofu, peanuts, and a perfectly balanced sweet-sour-salty sauce.",
    calories: "510 kcal",
    prepTime: "20 min",
    cookTime: "10 min",
    difficulty: "Medium",
    cuisine: "Thai",
    servings: 2,
    ingredients: [
      { name: "Rice Noodles", amount: "150g" },
      { name: "Shrimp", amount: "200g" },
      { name: "Tamarind Paste", amount: "3 tbsp" },
      { name: "Fish Sauce", amount: "2 tbsp" },
      { name: "Palm Sugar", amount: "2 tbsp" },
      { name: "Bean Sprouts", amount: "1 cup" },
      { name: "Roasted Peanuts", amount: "2 tbsp crushed" }
    ],
    steps: [
      "Soak rice noodles in warm water until soft but firm.",
      "Whisk tamarind, fish sauce, and sugar to make the sauce.",
      "Stir-fry shrimp until pink, then add tofu and noodles.",
      "Pour in the sauce and toss until noodles absorb the liquid.",
      "Fold in bean sprouts and top with crushed peanuts and lime."
    ],
    tags: ["Dinner", "Spicy", "Dairy-Free"],
    nutrition: {
      protein: "28g",
      carbs: "65g",
      fat: "16g",
      fiber: "4g"
    },
    drinkPairing: "Thai Tea or a cold Singha Beer"
  },
  {
    id: "featured-7",
    name: "The Ultimate Wagyu Burger",
    description: "A decadent American classic featuring a juicy Wagyu beef patty, melted cheddar, caramelized onions, and truffle aioli on a toasted brioche bun.",
    calories: "780 kcal",
    prepTime: "15 min",
    cookTime: "12 min",
    difficulty: "Medium",
    cuisine: "American",
    servings: 1,
    ingredients: [
      { name: "Wagyu Beef Patty", amount: "1/2 lb" },
      { name: "Brioche Bun", amount: "1" },
      { name: "Cheddar Cheese", amount: "1 slice" },
      { name: "Onions", amount: "1/2 large" },
      { name: "Mayonnaise", amount: "2 tbsp" },
      { name: "Truffle Oil", amount: "1/2 tsp" }
    ],
    steps: [
      "Caramelize onions in a pan with a little butter over low heat.",
      "Season the patty with salt and pepper and sear on a hot grill.",
      "Add cheese to the patty during the last minute of cooking to melt.",
      "Toast the brioche bun until golden.",
      "Mix mayo and truffle oil; assemble burger with onions and aioli."
    ],
    tags: ["Dinner", "Cheat-Meal", "High-Protein"],
    nutrition: {
      protein: "42g",
      carbs: "38g",
      fat: "54g",
      fiber: "2g"
    },
    drinkPairing: "Robust Cabernet Sauvignon or a Stout"
  },
  {
    id: "featured-8",
    name: "Mediterranean Quinoa Bowl",
    description: "A vibrant, protein-packed bowl featuring fluffy quinoa, roasted chickpeas, cucumber, Kalamata olives, and a zesty lemon-tahini dressing.",
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
    tags: ["Vegan", "Vegetarian", "Healthy", "Gluten-Free", "Lunch"],
    nutrition: {
      protein: "14g",
      carbs: "52g",
      fat: "18g",
      fiber: "12g"
    },
    drinkPairing: "Sparkling Water with Mint"
  },
  {
    id: "featured-9",
    name: "Provencal Ratatouille",
    description: "A traditional French vegetable stew from Nice, bursting with the flavors of summer eggplant, zucchini, peppers, and Herbes de Provence.",
    calories: "210 kcal",
    prepTime: "25 min",
    cookTime: "45 min",
    difficulty: "Medium",
    cuisine: "French",
    servings: 4,
    ingredients: [
      { name: "Eggplant", amount: "1 large" },
      { name: "Zucchini", amount: "2 medium" },
      { name: "Bell Peppers", amount: "2" },
      { name: "Tomatoes", amount: "4 large" },
      { name: "Olive Oil", amount: "3 tbsp" },
      { name: "Herbes de Provence", amount: "1 tbsp" }
    ],
    steps: [
      "Sauté onions and garlic in olive oil until soft.",
      "Add cubed peppers and eggplant, cooking until slightly tender.",
      "Stir in zucchini and tomatoes along with the herbs.",
      "Cover and simmer on low heat for 40 mins until veggies are jammy.",
      "Serve warm or at room temperature with crusty bread."
    ],
    tags: ["Vegan", "Vegetarian", "Gluten-Free", "Healthy", "Dinner"],
    nutrition: {
      protein: "4g",
      carbs: "22g",
      fat: "12g",
      fiber: "8g"
    },
    drinkPairing: "Cotes du Rhone or a light Pinot Noir"
  },
  {
    id: "featured-10",
    name: "Vietnamese Shrimp Spring Rolls",
    description: "Refreshing and light Gỏi Cuốn featuring poached shrimp, rice vermicelli, and fresh mint wrapped in delicate rice paper, served with peanut dip.",
    calories: "280 kcal",
    prepTime: "30 min",
    cookTime: "5 min",
    difficulty: "Medium",
    cuisine: "Asian",
    servings: 2,
    ingredients: [
      { name: "Rice Paper Wrappers", amount: "8 sheets" },
      { name: "Shrimp", amount: "16 medium" },
      { name: "Rice Vermicelli", amount: "50g" },
      { name: "Fresh Mint", amount: "1/2 cup" },
      { name: "Lettuce", amount: "4 leaves" },
      { name: "Peanut Butter", amount: "3 tbsp (for dip)" }
    ],
    steps: [
      "Poach shrimp and slice in half lengthwise.",
      "Cook vermicelli noodles and drain well.",
      "Dip rice paper in warm water for 5 seconds until pliable.",
      "Layer lettuce, noodles, mint, and shrimp on the wrapper.",
      "Roll tightly like a burrito and serve with peanut dipping sauce."
    ],
    tags: ["Healthy", "Dairy-Free", "Low-Carb", "Lunch"],
    nutrition: {
      protein: "18g",
      carbs: "35g",
      fat: "8g",
      fiber: "3g"
    },
    drinkPairing: "Green Tea or a Jasmine Tea"
  }
];
