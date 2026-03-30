/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import React, { useState, useEffect, useRef } from 'react';
import { searchFoods } from '../services/foodApi';

const FoodSearchInput = ({ placeholder, token, onFoodSelect }) => {
    // State for the search query, results, loading state, and dropdown visibility
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // This ref is used to prevent the search effect from running after a user clicks a dropdown item, which would otherwise cause an immediate re-search and crash the app due to rapid state changes.
    const skipNextSearch = useRef(false);

    useEffect(() => {
        // If empty, stop everything
        if (!query.trim()) {
            setResults([]);
            setShowDropdown(false);
            return;
        }

        // If the text changed because a result was selected, abort the search
        if (skipNextSearch.current) {
            skipNextSearch.current = false; // Stop c
            return;
        }

        // The normal fuse
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            setShowDropdown(true);

            const fetchedResults = await searchFoods(query, token);
            setResults(fetchedResults);

            setIsSearching(false);
        }, 800);

        return () => clearTimeout(delayDebounceFn);
    }, [query, token]);

    // When a user clicks a dropdown result: 
    // 1) Prevent the search effect from running again by arming the skipNextSearch ref
    // 2) Update the input field to show the name of the selected food
    // 3) Call the onFoodSelect callback with the selected food's ID so the parent component can load its details.
    const handleSelect = (foodId, foodName) => {
        skipNextSearch.current = true; 
        setQuery(foodName);
        setShowDropdown(false);
        onFoodSelect(foodId);
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            {/* When the user types, it updates the query state, which triggers the search effect. When the input is focused, if there is already a query, it re-opens the dropdown to show results. */}
            <input
                type="text"
                className="pill-input"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (query) setShowDropdown(true); }} // Re-open if clicked
            />

            {/* THE DROPDOWN UI */}
            {showDropdown && (
                <div style={{
                    position: 'absolute', top: '120%', left: 0, right: 0,
                    backgroundColor: '#0a0a0a', border: '1px solid #333',
                    borderRadius: '35px', zIndex: 100, overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                }}>
                    {/* The dropdown content changes based on the search state: it shows a loading message while searching, a list of results if found, or a "no matches" message if the search returns empty. */}
                    {isSearching ? (
                        <div style={{ padding: '15px', color: '#00ffcc', fontFamily: '"Courier New", monospace', fontSize: '0.85rem', textAlign: 'center' }}>
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '300px', overflowY: 'auto' }}> {/* Each result is rendered as a clickable list item. When hovered, the background color changes to provide visual feedback. Clicking an item triggers the handleSelect function, which updates the input field and notifies the parent component of the selection. */}
                            {results.map((food) => (
                                <li
                                    key={food.food_id}
                                    onClick={() => handleSelect(food.food_id, food.food_name)}
                                    style={{
                                        padding: '12px 15px', borderBottom: '1px solid #1a1a1a',
                                        cursor: 'pointer', transition: 'background 0.2s'
                                    }}

                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{food.food_name}</div>

                                    {/* The description usually contains the default serving size so users know what they are clicking */}
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>{food.food_description}</div>
                                </li>
                            ))}
                        </ul>

                    ) : (

                        <div style={{ padding: '15px', color: '#666', fontSize: '0.85rem', textAlign: 'center' }}>
                            No matches found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FoodSearchInput;