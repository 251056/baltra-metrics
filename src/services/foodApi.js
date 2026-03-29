/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */
const PROXY_URL = "https://bvltra-proxy.onrender.com/api/fatsecret-token";
const SEARCH_URL = "https://bvltra-proxy.onrender.com/api/search-food";
const DETAILS_URL = "https://bvltra-proxy.onrender.com/api/get-food";

// Get access token (temporary)
export const getAccessToken = async () => {
    try {
        const response = await fetch(PROXY_URL);
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Token error:", error);
        return null;
    }
};

// // Ask for the food data 
// export const searchFood = async (query, token) => {
//     try {
//         const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;

//         const response = await fetch(url, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}` 
//             }
//         });

//         const data = await response.json();

//         // Response
//         console.log("RAW FATSECRET RESPONSE:", data);

//         // Crash prevention
//         if (!data.foods || !data.foods.food) {
//             console.error("FatSecret didn't return food data. Read the raw response above to see why.");
//             return []; 
//         }

//         return data.foods.food; 
//     } catch (error) {
//         console.error("Search error:", error);
//         return [];
//     }
// };

export const searchFoods = async (query, token) => {
    try {
        // THE FIX: We are bouncing this through your Render proxy to bypass CORS
        const url = `${SEARCH_URL}?q=${encodeURIComponent(query)}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        // Safety check for empty results
        const foods = data.foods?.food;
        if (!foods) return [];

        // FatSecret quirk: normalize single objects into an array
        return Array.isArray(foods) ? foods : [foods];
    } catch (error) {
        console.error("Search error via proxy:", error);
        return [];
    }
};

export const getFoodDetails = async (foodId, token) => {
    try {
        const url = `${DETAILS_URL}?id=${foodId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!data.food) {
            console.error("FatSecret didn't return details for ID:", foodId);
            return null;
        }

        return data.food;
    } catch (error) {
        console.error("Details fetching error:", error);
        return null;
    }
};