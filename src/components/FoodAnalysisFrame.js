
/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const NutrientRow = ({ nutrientLabel, value }) => (
    <div className="nutrient-list-row">
        <span>{nutrientLabel}</span>
        <span className="nutrient-value-cell">{value}</span>
    </div>
);

const FoodAnalysisFrame = ({ foodData }) => {
    if (!foodData) return null;
    const serving = foodData.servings?.serving?.[0] || foodData.servings?.serving;
    if (!serving) return <p className="text-muted">No nutrient data available.</p>;

    const originalWeight = parseFloat(serving.metric_serving_amount);
    const ratio = (originalWeight && originalWeight > 0) ? (100 / originalWeight) : 1;

    const scale = (val, decimals = 1) => {
        if (!val || val === '-' || val === '< 1') return 0;
        return (parseFloat(val) * ratio).toFixed(decimals);
    };

    const scaledCarbs = scale(serving.carbohydrate);
    const scaledFat = scale(serving.fat);
    const scaledProtein = scale(serving.protein);
    const scaledCalories = scale(serving.calories, 0);

    const macroChartData = {
        labels: ['Carbohydrate (g)', 'Fat (g)', 'Protein (g)'],
        datasets: [{
            data: [scaledCarbs, scaledFat, scaledProtein],
            backgroundColor: ['rgba(16, 108, 147, 1)', 'rgba(202, 126, 20, 1)', 'rgba(185, 50, 52, 1)'],
            borderWidth: 0,
        }]
    };

    const macroChartOptions = {
        cutout: '60%', plugins: { legend: { display: false } }, maintainAspectRatio: true
    };

    return (
        <div className="food-analysis-frame">
            <h2 className="macro-card-title">
                {foodData.food_name}
            </h2>

            <div className="chart-container">
                <Doughnut data={macroChartData} options={macroChartOptions} />
            </div>

            <p className="analysis-summary-text">
                There are <strong style={{ color: '#fff' }}>{scaledCalories} calories</strong> in 100g of {foodData.food_name}. <br />
                Macro breakdown per 100g:
                <span style={{ color: 'rgba(202, 126, 20, 1)', fontWeight: 'bold' }}> {scaledFat}g fat</span>,
                <span style={{ color: 'rgba(16, 108, 147, 1)', fontWeight: 'bold' }}> {scaledCarbs}g carbs</span>,
                <span style={{ color: 'rgba(185, 50, 52, 1)', fontWeight: 'bold' }}> {scaledProtein}g protein</span>.
            </p>

            <div className="nutrient-grid-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.8rem', fontWeight: 'bold', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span>Nutrient</span><span>100g</span>
                </div>
                <NutrientRow nutrientLabel="Calories" value={`${scaledCalories}`} />
                <NutrientRow nutrientLabel="Protein" value={`${scaledProtein}g`} />
                <NutrientRow nutrientLabel="Total Fat" value={`${scaledFat}g`} />
                <NutrientRow nutrientLabel="- Saturated Fat" value={`${scale(serving.saturated_fat)}g`} />
                <NutrientRow nutrientLabel="- Polyunsaturated Fat" value={`${scale(serving.polyunsaturated_fat)}g`} />
                <NutrientRow nutrientLabel="- Monounsaturated Fat" value={`${scale(serving.monounsaturated_fat)}g`} />
                <NutrientRow nutrientLabel="Total Carbohydrate" value={`${scaledCarbs}g`} />
                <NutrientRow nutrientLabel="- Dietary Fiber" value={`${scale(serving.fiber)}g`} />
                <NutrientRow nutrientLabel="- Sugars" value={`${scale(serving.sugar)}g`} />
                <NutrientRow nutrientLabel="Cholesterol" value={`${scale(serving.cholesterol)}mg`} />
                <NutrientRow nutrientLabel="Sodium" value={`${scale(serving.sodium)}mg`} />
                <NutrientRow nutrientLabel="Potassium" value={`${scale(serving.potassium)}mg`} />
            </div>
        </div>
    );
};

export default FoodAnalysisFrame;