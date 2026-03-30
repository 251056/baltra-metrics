/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

// The telemetry service is responsible for logging the user's search history and interactions with the food data. It provides two main functions: logSearchHistory, which takes the raw food data returned from the API and extracts the relevant nutritional information to store in a clean format; and getSearchHistory, which retrieves the stored search history from the browser's local storage. 
export const logSearchHistory = (foodData) => {
  if (!foodData || !foodData.servings?.serving) return;

  // FatSecret's API can return the serving information as either an object or an array (if there are multiple serving sizes). To handle this inconsistency, this checks if it's an array and take the first item, otherwise it uses it directly. 
  const serving = Array.isArray(foodData.servings.serving) 
    ? foodData.servings.serving[0] 
    : foodData.servings.serving;

  // Normalize to 100g for an apples-to-apples comparison
  const originalWeight = parseFloat(serving.metric_serving_amount);
  const ratio = (originalWeight && originalWeight > 0) ? (100 / originalWeight) : 1;

  const scale = (val) => {
    if (!val || val === '-' || val === '< 1') return 0;
    return parseFloat((parseFloat(val) * ratio).toFixed(1));
  };

  // Store the food into a clean data object
  const newLog = {
    id: Date.now(), // Unique timestamp
    name: foodData.food_name.substring(0, 15) + (foodData.food_name.length > 15 ? '...' : ''), // Keep names short for the graph
    Calories: scale(serving.calories),
    Protein: scale(serving.protein),
    Carbs: scale(serving.carbohydrate),
    Fat: scale(serving.fat),
    Sugar: scale(serving.sugar)
  };

  // Pull the existing history from the browser, or start a new array
  const existingHistory = JSON.parse(localStorage.getItem('bvltra_telemetry')) || [];

  // Add the new food to the FRONT of the array
  existingHistory.unshift(newLog);

  // Force the array to only keep the last 7 items (destroying the oldest)
  const trimmedHistory = existingHistory.slice(0, 7);

  // 5. Save it back to the browser
  localStorage.setItem('bvltra_telemetry', JSON.stringify(trimmedHistory));
};

export const getSearchHistory = () => {
  return JSON.parse(localStorage.getItem('bvltra_telemetry')) || [];
};