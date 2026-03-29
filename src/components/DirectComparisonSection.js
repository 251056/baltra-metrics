/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import { Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from 'chart.js';

// Registering only what the Bar chart needs locally
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DirectComparisonSection = ({ foodA, foodB }) => {
    if (!foodA || !foodB) return null;

    const getServing = (data) => data.servings?.serving?.[0] || data.servings?.serving;
    const sA = getServing(foodA);
    const sB = getServing(foodB);

    // --- MATH: Normalize to 100g ---
    const ratioA = (parseFloat(sA.metric_serving_amount) > 0) ? (100 / parseFloat(sA.metric_serving_amount)) : 1;
    const ratioB = (parseFloat(sB.metric_serving_amount) > 0) ? (100 / parseFloat(sB.metric_serving_amount)) : 1;

    const scale = (val, ratio) => {
        if (!val || val === '-' || val === '< 1') return 0;
        return (parseFloat(val) * ratio).toFixed(1);
    };

    // Pre-calculate all values so the JSX is clean
    const valA = {
        calories: scale(sA.calories, ratioA),
        protein: scale(sA.protein, ratioA),
        sugar: scale(sA.sugar, ratioA),
        fiber: scale(sA.fiber, ratioA)
    };

    const valB = {
        calories: scale(sB.calories, ratioB),
        protein: scale(sB.protein, ratioB),
        sugar: scale(sB.sugar, ratioB),
        fiber: scale(sB.fiber, ratioB)
    };

    // --- Data Structure ---
    const createBarData = (val1, val2) => ({
        labels: [foodA.food_name, foodB.food_name], // The Y-Axis text
        datasets: [{
            data: [val1, val2], // The physical length of the bars
            backgroundColor: [
                'rgba(16, 108, 147, 1)', // (Food A)
                'rgba(185, 50, 52, 1)'   // (Food B)
            ],
            borderRadius: 4,
            barThickness: 24 // Forces the bars to be thick and readable
        }]
    });

    const barOptions = {
        indexAxis: 'y', // Flips the chart horizontally
        responsive: true,
        maintainAspectRatio: false, // Allows the chart to fill the container
        plugins: {
            legend: { display: false }, // Colors explain themselves
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.raw}`
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#888', font: { family: '"Courier New", monospace' } },
                beginAtZero: true
            },
            y: {
                grid: { display: false }, // Hides the horizontal grid lines for a cleaner look
                ticks: { color: '#ccc', font: { family: '"Courier New", monospace', size: 11 } }
            }
        }
    };

    // --- COMPONENT: Builds the individual tiles ---
    const ComparisonTile = ({ title, desc, val1, val2 }) => (
        <Col lg={6} md={12}>
            <div className="radar-frame"> {/* Re-using the isolated tile class */}
                <h4 className="radar-title">{title}</h4>

                <div style={{ height: '140px', width: '100%' }}>
                    <Bar data={createBarData(val1, val2)} options={barOptions} />
                </div>

                <p style={{ color: '#666', fontSize: '0.8rem', fontFamily: '"Courier New", monospace', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
                    {desc}
                </p>
            </div>
        </Col>
    );

    return (
        <div className="mt-5 pt-5 border-top border-secondary">
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '3rem', color: '#fff', textAlign: 'center', marginBottom: '0px' }}>
                Direct Comparison
            </h2>

            {/* Grid setup */}
            <Row className="g-4">
                <ComparisonTile title="CALORIC LOAD (kcal)" desc="Energy density per 100g" val1={valA.calories} val2={valB.calories} />
                <ComparisonTile title="PROTEIN DENSITY (g)" desc="Muscle synthesis potential per 100g" val1={valA.protein} val2={valB.protein} />
                <ComparisonTile title="SUGAR CONTENT (g)" desc="Glycemic impact per 100g" val1={valA.sugar} val2={valB.sugar} />
                <ComparisonTile title="DIETARY FIBER (g)" desc="Digestive efficiency per 100g" val1={valA.fiber} val2={valB.fiber} />
            </Row>
        </div>
    );
};

export default DirectComparisonSection;