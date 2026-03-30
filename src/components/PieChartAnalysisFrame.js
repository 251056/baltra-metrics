
/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

//
import CustomMacroBar from './CustomMacroBar';

ChartJS.register(ArcElement, Tooltip);

// The FoodAnalysisFrame component is responsible for displaying a detailed analysis of a selected food item. It takes the food data as a prop, extracts the relevant nutritional information, and presents it in both a visual format (using a doughnut chart to show the macronutrient breakdown) and a textual format (providing specific values for calories, protein, fat, carbohydrates, and other nutrients). The component also normalizes the nutrient values to a standard 100g serving size to allow for easy comparison between different foods. If no data is available, it displays a message indicating so.
const NutrientRow = ({ nutrientLabel, value }) => (
    <div className="nutrient-list-row">
        <span>{nutrientLabel}</span>
        <span className="nutrient-value-cell">{value}</span>
    </div>
);

// The main component that renders the food analysis frame, including the title, doughnut chart, summary text, and a grid of specific nutrient values.
const FoodAnalysisFrame = ({ foodData }) => {
    if (!foodData) return null;

    // Extract the serving information, which may be an array or a single object. If no serving data is available, display a message indicating that nutrient data is not available.
    const serving = foodData.servings?.serving?.[0] || foodData.servings?.serving;
    if (!serving) return <p className="text-muted">No nutrient data available.</p>;

    // --- MATH: Normalize to 100g ---
    // This section calculates the ratio needed to scale the nutrient values to a standard 100g serving size. It checks the original weight of the serving and computes a ratio that can be applied to all nutrient values. The scale function is then used to apply this ratio to each nutrient, ensuring that the displayed values are consistent and comparable across different foods, regardless of their original serving sizes.
    const originalWeight = parseFloat(serving.metric_serving_amount);
    const ratio = (originalWeight && originalWeight > 0) ? (100 / originalWeight) : 1;

    // The scale function takes a nutrient value and applies the normalization ratio. It also handles cases where the value might be missing or represented as a non-numeric string (like '-' or '< 1'), returning 0 in those cases to avoid errors in calculations and display.
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

    // The macroChartOptions object configures the appearance of the doughnut chart, including the cutout size to create a donut shape, hiding the legend since we provide a textual summary, and maintaining the aspect ratio for consistent display across different screen sizes.
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

            {/* --- THE NEW CUSTOM REQUIREMENT WIDGET --- */}
            <CustomMacroBar 
                protein={scaledProtein} 
                carbs={scaledCarbs} 
                fat={scaledFat} 
            />

            {/* The nutrient grid is a structured layout that lists specific nutrient values. Each row displays the name of the nutrient and its corresponding value per 100g. The grid includes key nutrients such as calories, protein, fat (with subcategories), carbohydrates (with subcategories), cholesterol, sodium, and potassium. */}
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