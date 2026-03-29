import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import bgImage from './assets/hero-header-compare.jpg';
import './ComparePage.css';
import { getAccessToken, getFoodDetails } from './services/foodApi';

// Import components
import GlobalLegend from './components/GlobalLegend';
import FoodAnalysisFrame from './components/FoodAnalysisFrame';
import MicronutrientFrame from './components/MicronutrientFrame';

function ComparePage() {
    const [baconData, setBaconData] = useState(null);
    const [fishData, setFishData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComparisonData = async () => {
            const token = await getAccessToken();
            if (token) {
                const baconResponse = await getFoodDetails("794", token);
                const fishResponse = await getFoodDetails("3570", token);
                setBaconData(baconResponse);
                setFishData(fishResponse);
            }
            setLoading(false);
        };
        loadComparisonData();
    }, []);

    const heroStyle = {
        backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, #050505 100%), url(${bgImage})`
    };

    return (
        <div className="compare-container">
            <div className="compare-hero" style={heroStyle}>
                <h1 className="compare-title">Statistics</h1>
                <div className="search-row">
                    <input type="text" className="pill-input" placeholder="Search Bacon..." />
                    <span className="compare-label">compare</span>
                    <input type="text" className="pill-input" placeholder="Search Fish..." />
                </div>
            </div>

            <Container className="pt-5 mt-4">
                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem' }}>INITIALIZING ENGINE / ANALYZING DATA...</div>
                ) : (
                    <>
                        <GlobalLegend />
                        <Row>
                            {/* Column 1 (Food A - Bacon) */}
                            <Col md={6} className="analysis-column">
                                <FoodAnalysisFrame foodData={baconData} />
                                <MicronutrientFrame foodData={baconData} />
                            </Col>

                            {/* Column 2 (Food B - Fish) */}
                            <Col md={6} className="analysis-column">
                                <FoodAnalysisFrame foodData={fishData} />
                                <MicronutrientFrame foodData={fishData} />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
}

export default ComparePage;