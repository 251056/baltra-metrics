/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Hero from '../components/Hero';
import { Container, Row, Col } from 'react-bootstrap';
import { getAccessToken, getFoodDetails } from '../services/foodApi';


import FoodAnalysisFrame from '../components/PieChartAnalysisFrame';
import anatomyImage from '../assets/chef-pan-anatomy.png'; 
import Footer from '../components/Footer'; 

// --- MAIN PAGE ---
function LandingPage() {
    const [foodAData, setFoodAData] = useState(null);
    const [foodBData, setFoodBData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate(); 

    useEffect(() => {
        const loadComparisonData = async () => {
            const token = await getAccessToken();
            if (token) {
                // Demo foods
                const foodA = await getFoodDetails("794", token);
                const foodB = await getFoodDetails("3570", token);

                setFoodAData(foodA);
                setFoodBData(foodB);
            }
            setLoading(false);
        };
        loadComparisonData();
    }, []);

    return (
        // NEW: Removed paddingBottom: '100px' so the footer sits flush at the bottom
        <div style={{ backgroundColor: '#040404', color: 'white', minHeight: '100vh' }}>
            <Hero />

            <Container className="pt-0 mt-4">

                {/* --- ANATOMY SECTION --- */}
                <div>
                    <hr style={{ borderColor: '#333', borderWidth: '1px', opacity: 1, margin: '20px 0 0 0' }} />

                    <Row className="align-items-center m-0">
                        
                        <Col lg={6} md={12} className="p-0 text-center text-lg-start">
                            <img 
                                src={anatomyImage} 
                                alt="Anatomy of an ingredient" 
                                style={{ 
                                    maxWidth: '100%', 
                                    height: 'auto', 
                                    display: 'block', // Prevents tiny gaps under the image
                                    margin: '0 auto'
                                }} 
                            />
                        </Col>

                        {/* Right Side: The Text */}
                        <Col lg={6} md={12} className="d-flex flex-column justify-content-center align-items-center align-items-lg-end text-center text-lg-end p-0">
                            
                            {/* Text Wrapper limits width but moves as a single unit */}
                            <div style={{ maxWidth: '480px', padding: '20px' }}>
                                <h2 style={{ 
                                    fontFamily: '"Playfair Display", serif', 
                                    fontSize: 'clamp(2.5rem, 4vw, 4.2rem)', 
                                    color: '#edeae5', 
                                    margin: '0 0 20px 0',
                                    letterSpacing: '-1px',
                                    lineHeight: '1.1'
                                }}>
                                    The Anatomy of<br />Every Ingredient.
                                </h2>
                                <p style={{ 
                                    color: '#a0a0a0', 
                                    fontSize: '0.9rem', 
                                    margin: 0,
                                    lineHeight: '1.6',
                                    fontWeight: '300'
                                }}>
                                    Sophistication is rooted in clarity. BVLTRA Metrics provides a 
                                    refined lens into the fundamental building blocks of your 
                                    diet. By deconstructing the complexity of nutrition into 
                                    precise, searchable data, we allow you to curate your intake 
                                    with uncompromising accuracy. Because understanding 
                                    what fuels you is the first step toward mastering the self.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* --- HEADING --- */}
                <div style={{ borderTop: '1px solid #333', paddingTop: '40px', marginBottom: '60px' }}>
                    <Row className="align-items-center">

                        {/* Text-center (mobile) and text-lg-start (desktop) */}
                        <Col lg={7} md={12} className="mb-4 mb-lg-0 text-center text-lg-start">
                            <h2 style={{
                                fontFamily: '"Playfair Display", serif',
                                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                                color: '#edeae5',
                                margin: 0,
                                letterSpacing: '-1px',
                                lineHeight: '1.1'
                            }}>
                                Quantified Sustenance
                            </h2>
                        </Col>

                        <Col lg={5} md={12} className="text-center text-lg-end">
                            <p style={{
                                color: '#a0a0a0',
                                fontSize: '0.9rem',
                                margin: 0,
                                lineHeight: '1.6',
                                fontWeight: '300'
                            }}>
                                Selection begins with understanding. BVLTRA Metrics offers a curated data experience,
                                allowing you to observe the underlying structures of your nutrition. We don't just
                                provide numbers; we provide the standard for dietary clarity.
                            </p>
                        </Col>
                    </Row>
                </div>

                {/* --- DATA --- */}
                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '2px', fontFamily: '"Courier New", monospace' }}>
                        Loading demo data...
                    </div>
                ) : (
                    <Row className="g-4">
                        <Col md={6}>
                            <FoodAnalysisFrame foodData={foodAData} />
                        </Col>

                        <Col md={6}>
                            <FoodAnalysisFrame foodData={foodBData} />
                        </Col>
                    </Row>
                )}

                {/* --- CALL TO ACTION BUTTON --- */}
                <div style={{ textAlign: 'center', marginTop: '80px', paddingBottom: '40px' }}>
                    <h3 style={{ fontFamily: '"Playfair Display", serif', color: '#fff', marginBottom: '25px', fontSize: '2rem' }}>
                        Intrigued by the data?
                    </h3>
                    
                    <button 
                        onClick={() => navigate('/compare')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#00ffcc',
                            border: '1px solid #00ffcc',
                            padding: '12px 35px',
                            borderRadius: '30px',
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 0 15px rgba(0, 255, 204, 0.1)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#00ffcc';
                            e.target.style.color = '#000';
                            e.target.style.boxShadow = '0 0 20px rgba(0, 255, 204, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#00ffcc';
                            e.target.style.boxShadow = '0 0 15px rgba(0, 255, 204, 0.1)';
                        }}
                    >
                        Try It Yourself
                    </button>
                </div>
            </Container>
        </div>
    );
}

export default LandingPage;