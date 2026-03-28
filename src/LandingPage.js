/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */
import React, { useEffect, useState } from 'react';
import Hero from './hero';
import { Container, Row, Col } from 'react-bootstrap';
import { getAccessToken, getFoodDetails } from './services/foodApi';

// --- CUSTOM COMPONENT ---
// This builds the individual data rows for the mockup
const StatRow = ({ label, value, unit }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid #333',
        padding: '8px 0',
        fontSize: '0.9rem',
        color: '#ccc'
    }}>
        <span style={{ fontWeight: 'bold', color: '#fff' }}>{label}</span>
        <span>{value ? `${value}${unit}` : `0${unit}`}</span>
    </div>
);

const NutritionColumn = ({ foodData }) => {
    if (!foodData) return null;

    // FatSecret sometimes returns an array of servings, sometimes a single object. 
    // This safely extracts the first available serving data.
    const rawServing = foodData.servings?.serving;
    const serving = Array.isArray(rawServing) ? rawServing[0] : rawServing;

    if (!serving) return <p>No serving data available.</p>;

    return (
        <div style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: '4px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
            <h3 style={{ color: '#00ffcc', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                {foodData.food_name}
            </h3>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '20px' }}>
                {foodData.food_type === 'Brand' ? foodData.brand_name : 'Generic'} | {serving.measurement_description}
            </p>

            {/* Data Grid format */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <StatRow label="Calories" value={serving.calories} unit=" kcal" />
                <StatRow label="Protein" value={serving.protein} unit="g" />
                <StatRow label="Total Carbohydrate" value={serving.carbohydrate} unit="g" />
                <StatRow label="Total Fat" value={serving.fat} unit="g" />
                <StatRow label="Saturated Fat" value={serving.saturated_fat} unit="g" />
                <StatRow label="Cholesterol" value={serving.cholesterol} unit="mg" />
                <StatRow label="Sodium" value={serving.sodium} unit="mg" />
                <StatRow label="Fiber" value={serving.fiber} unit="g" />
                <StatRow label="Sugar" value={serving.sugar} unit="g" />
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
function LandingPage() {
    const [baconData, setBaconData] = useState(null);
    const [fishData, setFishData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComparisonData = async () => {
            const token = await getAccessToken();
            if (token) {
                // Fetching ID 794 (Find bacon) and ID 3570 (Find Salmon/Fish)... Like, these are the wrong IDs, so actually, find the right ones
                const bacon = await getFoodDetails("794", token);
                const fish = await getFoodDetails("3570", token);

                setBaconData(bacon); //ITS NOT BACON
                setFishData(fish); //YOU WISH IT WAS FISH
            }
            setLoading(false);
        };
        loadComparisonData();
    }, []);

    return (
        <div style={{ backgroundColor: '#050505', color: 'white', minHeight: '100vh', paddingBottom: '100px' }}>
            <Hero />

            <Container className="pt-5 mt-4">
                <h2 style={{ letterSpacing: '2px', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '15px', marginBottom: '30px' }}>
                    COMPARATIVE ANALYSIS/ <span style={{ color: '#00ffcc' }}>MACROS</span>
                </h2>

                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '2px' }}>INITIALIZING ENGINE...</div>
                ) : (
                    <Row>
                        {/* Double check id */}
                        {/* Column 1: Bacon ??*/}
                        <Col md={6} className="mb-4">
                            <NutritionColumn foodData={baconData} />
                        </Col>

                        {/* Column 2: Fish ??*/}
                        <Col md={6} className="mb-4">
                            <NutritionColumn foodData={fishData} />
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default LandingPage;