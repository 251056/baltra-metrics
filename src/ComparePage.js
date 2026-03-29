import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import bgImage from './assets/hero-header-compare.jpg';
import './ComparePage.css';
import { getAccessToken, getFoodDetails } from './services/foodApi';

// Components
import GlobalLegend from './components/GlobalLegend';
import FoodAnalysisFrame from './components/FoodAnalysisFrame';
import MicronutrientFrame from './components/MicronutrientFrame';
import DirectComparisonSection from './components/DirectComparisonSection';
import FoodSearchInput from './components/FoodSearchInput'; 

function ComparePage() {
    // Dynamic states 
    const [foodAData, setFoodAData] = useState(null);
    const [foodBData, setFoodBData] = useState(null);
    const [token, setToken] = useState(null);
    
    // Loading state is defined here 
    const [loading, setLoading] = useState(true); 

    // Grab auth token when the page loads
    useEffect(() => {
        const initEngine = async () => {
            const fetchedToken = await getAccessToken();
            setToken(fetchedToken);
            setLoading(false); // Readyyyyy
        };
        initEngine();
    }, []);

    // When a user clicks a dropdown result
    const handleLoadFoodA = async (foodId) => {
        if (!token) return;
        const data = await getFoodDetails(foodId, token);
        setFoodAData(data);
    };

    const handleLoadFoodB = async (foodId) => {
        if (!token) return;
        const data = await getFoodDetails(foodId, token);
        setFoodBData(data);
    };

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

            <Container className="pt-5 mt-4">
                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem' }}>INITIALIZING...</div>
                ) : (!foodAData && !foodBData) ? (
                    <div style={{ color: '#666', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem', fontFamily: '"Courier New", monospace' }}>
                        AWAITING INPUT...
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