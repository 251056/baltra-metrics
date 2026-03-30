/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */
import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import bgImage from '../assets/hero-header-compare.jpg';
import './ComparePage.css';
import { getAccessToken, getFoodDetails, searchFoods } from '../services/foodApi';

import { useSearchParams } from 'react-router-dom';

// Components
import GlobalLegend from '../components/GlobalLegend';
import FoodAnalysisFrame from '../components/PieChartAnalysisFrame';
import MicronutrientFrame from '../components/RadarGraph';
import DirectComparisonSection from '../components/BarGraph';
import FoodSearchInput from '../components/FoodSearchInput'; 
import { logSearchHistory } from '../services/telemetry';

function ComparePage() {
    // State for both food items, initialized from localStorage to persist across sessions
    // Fixes the food disappearing issue by ensuring that the state is preserved even if the user accidentally triggers a re-render that would otherwise reset it, like leaving the page.
    const [foodAData, setFoodAData] = useState(() => {
        const savedA = localStorage.getItem('bvltra_compare_A');
        return savedA ? JSON.parse(savedA) : null;
    });

    const [foodBData, setFoodBData] = useState(() => {
        const savedB = localStorage.getItem('bvltra_compare_B');
        return savedB ? JSON.parse(savedB) : null;
    });

    const [token, setToken] = useState(null);
    
    // Loading state is defined here 
    const [loading, setLoading] = useState(true); 

    // The Sensor that reads the URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Grab the auth token, and check if we were sent here by the global search
    useEffect(() => {
        const initEngine = async () => {
            const fetchedToken = await getAccessToken();
            setToken(fetchedToken);

            // --- URL reader ---
            const globalQuery = searchParams.get('search'); // Looks for ?search=...
            
            if (globalQuery && fetchedToken) {
                // Find top matches for that word
                const searchResults = await searchFoods(globalQuery, fetchedToken);
                
                if (searchResults && searchResults.length > 0) {
                    // Get ID of the closest match
                    const topResultId = searchResults[0].food_id;
                    
                    // Fetch and load it into Slot A
                    const data = await getFoodDetails(topResultId, fetchedToken);
                    setFoodAData(data);
                    localStorage.setItem('bvltra_compare_A', JSON.stringify(data));
                    logSearchHistory(data);
                }
                
                // Reamove the search term from the URL so it doesn't get stuck in a loop if you refresh
                setSearchParams({});
            }

            setLoading(false); // Readyyyyy
        };
        initEngine();
    }, []);

    // When a user clicks a dropdown result
    const handleLoadFoodA = async (foodId) => {
        if (!token) return;
        const data = await getFoodDetails(foodId, token);

        setFoodAData(data); // Updates the UI
        localStorage.setItem('bvltra_compare_A', JSON.stringify(data)); // Locks it into browser memory

        logSearchHistory(data);  // Save food A for history

    };
    // When a user clicks a dropdown result
    const handleLoadFoodB = async (foodId) => {
        if (!token) return;
        const data = await getFoodDetails(foodId, token);

        setFoodBData(data); // Updates the UI
        localStorage.setItem('bvltra_compare_B', JSON.stringify(data)); // Locks it into browser memory

        logSearchHistory(data);  // Save food B for history

    };

    // Hero section style with background image and overlay
    const heroStyle = {
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, #050505 100%), url(${bgImage})`
    };

    return (
        <div className="compare-container">
            <div className="compare-hero" style={heroStyle}>
                <h1 className="compare-title">Statistics</h1>
                
                <div className="search-row">
                    <FoodSearchInput 
                        placeholder="Search Item 1..." 
                        token={token} 
                        onFoodSelect={handleLoadFoodA} 
                    />
                    <span className="compare-label">compare</span>
                    <FoodSearchInput 
                        placeholder="Search Item 2..." 
                        token={token} 
                        onFoodSelect={handleLoadFoodB} 
                    />
                </div>
            </div>

            {/* The rest of the page is conditionally rendered based on loading state and whether food data exists, with a new "Awaiting Input" message if neither food is selected yet. */}
            <Container className="pt-4 mt-4">
                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem', fontFamily: '"Courier New", monospace' }}>Getting things ready, please wait...</div>
                ) : (!foodAData && !foodBData) ? (
                    <div style={{ color: '#666', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem', fontFamily: '"Courier New", monospace' }}>
                        Ready to compare. Awaiting input...
                    </div>
                ) : (
                    <>
                        <GlobalLegend />
                        <Row>
                            <Col md={6} className="analysis-column">
                                {foodAData && (
                                    <>
                                        <FoodAnalysisFrame foodData={foodAData} />
                                        <MicronutrientFrame foodData={foodAData} />
                                    </>
                                )}
                            </Col>

                            <Col md={6} className="analysis-column">
                                {foodBData && (
                                    <>
                                        <FoodAnalysisFrame foodData={foodBData} />
                                        <MicronutrientFrame foodData={foodBData} />
                                    </>
                                )}
                            </Col>
                        </Row>

                        {/* Renders the Bar Charts only if BOTH foods are selected */}
                        {foodAData && foodBData && (
                            <DirectComparisonSection foodA={foodAData} foodB={foodBData} />
                        )}
                    </>
                )}
            </Container>
        </div>
    );
}

export default ComparePage;