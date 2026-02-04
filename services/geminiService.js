import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    calories: { type: Type.STRING },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    cuisine: { type: Type.STRING },
    servings: { type: Type.INTEGER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          amount: { type: Type.STRING }
        },
        required: ["name", "amount"]
      }
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
        fiber: { type: Type.STRING }
      },
      required: ["protein", "carbs", "fat", "fiber"]
    },
    drinkPairing: { type: Type.STRING }
  },
  required: ["name", "description", "calories", "ingredients", "steps", "prepTime", "cookTime", "difficulty", "servings", "nutrition", "drinkPairing", "cuisine"]
};

export const generateRecipes = async (ingredients) => {
  if (ingredients.length === 0) return [];

  // Use gemini-3-flash-preview for general text generation and structured data
  const model = "gemini-3-flash-preview"; 
  
  const prompt = `
    I have the following ingredients available: ${ingredients.join(", ")}.
    
    Please suggest 3 distinct, delicious recipes that I can make primarily using these ingredients. 
    You may assume I have basic pantry staples like salt, pepper, oil, water, and flour.
    
    **CRITICAL**: Try to include diverse cuisines, specifically at least one Indian-style recipe (e.g., Curry, Masala, Stir-fry) if the ingredients allow.
    
    For each recipe, provide the requested details in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class chef and nutritionist specializing in global cuisines. Your goal is to create creative, feasible, and healthy recipes based on limited user inputs. Be precise with measurements and nutritional estimates.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from AI");
    }

    const recipes = JSON.parse(jsonText);
    
    return recipes.map((r, index) => ({
      ...r,
      id: `recipe-ing-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};

export const generateRecipeByName = async (dishName) => {
  if (!dishName.trim()) return [];

  const model = "gemini-3-flash-preview"; 
  
  const prompt = `
    Please provide a highly authentic and detailed recipe for "${dishName}".
    
    For this recipe, provide full details as per the required schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert chef specializing in global cuisines. Provide a high-quality, professional recipe for the requested dish. Return the result as a JSON array containing exactly one recipe object.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from AI");
    }

    const recipes = JSON.parse(jsonText);
    
    return recipes.map((r, index) => ({
      ...r,
      id: `recipe-name-${Date.now()}-${index}`
    }));

  } catch (error) {
    console.error("Error generating recipe by name:", error);
    throw error;
  }
};
