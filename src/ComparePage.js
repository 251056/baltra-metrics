import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import bgImage from './assets/hero-header-compare.jpg';
import './ComparePage.css';
import { getAccessToken, getFoodDetails } from './services/foodApi';

// Chart components
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the minimum required components for the doughnut to work
ChartJS.register(ArcElement, Tooltip);

// !!!!!!!!!!!!!!!!!!! REMEBER TO SEPARATE THIS INTO COMPONENTS LATER, THIS IS JUST A PROOF OF CONCEPT FOR NOW.
// I know that its not fish and bacon... but for the sake of the mockup and the lack of effort to fix it now... bacon is the milk, and fish is the 100% Whole Wheat Bread with Raisins... very specific, i know... but it was either that or use the same food twice and call it "Food A" and "Food B" which is just sad. And like, i know i can find the right IDs, but this is also just funny lol.

// --- COMPONENT: Color Legend for charts ---
const GlobalLegend = () => (
    <div style={{
        display: 'flex',
        gap: '20px',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.85rem',
        color: '#eee',
        marginBottom: '30px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(16, 108, 147, 1)' }}></span> Carbohydrate
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(202, 126, 20, 1)' }}></span> Fat
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(185, 50, 52, 1)' }}></span> Protein
        </div>
    </div>
);

// --- COMPONENT: Nutrient Row ---
const NutrientRow = ({ nutrientLabel, value }) => (
    <div className="nutrient-list-row">
        <span>{nutrientLabel}</span>
        <span className="nutrient-value-cell">{value}</span>
    </div>
);


// --- COMPONENT: Food card ---
const FoodAnalysisFrame = ({ foodData }) => {
  if (!foodData) return null;
  // in case the API returns an array of servings, take the first one. If it returns a single object, use that one only. 
  const serving = foodData.servings?.serving?.[0] || foodData.servings?.serving;
  if (!serving) return <p className="text-muted">No nutrient data available.</p>;

  // --- MATH: Normalizing to 100g ---
  // Note: If you change the base value here, dont forget to change it in the summary text and the chart data aka 'NORMALIZED NUTRITION LIST'.
  const originalWeight = parseFloat(serving.metric_serving_amount);
  // If the API doesn't give a blank/zero gram weight, we default to a 1:1 ratio so the math doesn't break
  const ratio = (originalWeight && originalWeight > 0) ? (100 / originalWeight) : 1;

  // Function to multiply and round the data
  const scale = (val, decimals = 1) => {
    if (!val || val === '-' || val === '< 1') return 0; // Handle missing or non-numeric values like "< 1" or "-"
    return (parseFloat(val) * ratio).toFixed(decimals);
  };

  // Scaled Macros (main ones)
  const scaledCarbs = scale(serving.carbohydrate);
  const scaledFat = scale(serving.fat);
  const scaledProtein = scale(serving.protein);
  const scaledCalories = scale(serving.calories, 0); // 0 decimals for calories for cleaner look

  // --- CHART ---
  const macroChartData = {
    labels: ['Carbohydrate (g)', 'Fat (g)', 'Protein (g)'],
    datasets: [{
      data: [scaledCarbs, scaledFat, scaledProtein],
      backgroundColor: [
        'rgba(16, 108, 147, 1)',
        'rgba(202, 126, 20, 1)',
        'rgba(185, 50, 52, 1)'
      ],
      borderWidth: 0,
    }]
  };

  const macroChartOptions = {
    cutout: '60%', // Creates the donut shape by cutting out the center
    plugins: { legend: { display: false } },
    maintainAspectRatio: true 
  };

  return (
    <div className="food-analysis-frame">
      {/* SERIF TITLE (Matches "Statistics" font) */}
      <h2 style={{ 
        fontFamily: '"Playfair Display", "Times New Roman", serif', 
        fontSize: '3rem', 
        fontWeight: 'normal',
        marginBottom: '40px',
        color: '#fff'
      }}>
        {foodData.food_name}
      </h2>

      <div className="chart-container">
        <Doughnut data={macroChartData} options={macroChartOptions} />
      </div>

      {/* SUMMARY TEXT */}
      <p className="analysis-summary-text">
        There are <strong style={{color:'#fff'}}>{scaledCalories} calories</strong> in 100g of {foodData.food_name}. <br/>
        Macro breakdown per 100g: {/* Color-coded to make it easier to read */}
        <span style={{ color: 'rgba(202, 126, 20, 1)', fontWeight: 'bold' }}> {scaledFat}g fat</span>, 
        <span style={{ color: 'rgba(16, 108, 147, 1)', fontWeight: 'bold' }}> {scaledCarbs}g carbs</span>, 
        <span style={{ color: 'rgba(185, 50, 52, 1)', fontWeight: 'bold' }}> {scaledProtein}g protein</span>.
      </p>

      {/* NORMALIZED NUTRITION LIST */}
      <div className="nutrient-grid-container">
        <div style={{display:'flex', justifyContent:'space-between', color:'#666', fontSize:'0.8rem', fontWeight:'bold', borderBottom:'2px solid #333', paddingBottom:'10px', marginBottom:'10px'}}>
            <span>Nutrient</span>
            <span>100g</span> {/* This comment will make sense when you need it lol */}
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

// --- MAIN PAGE ---
function ComparePage() {
    // State variables to hold data for Food A (Bacon) and Food B (Fish)
    const [baconData, setBaconData] = useState(null);
    const [fishData, setFishData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data loading logic
    useEffect(() => {
        const loadComparisonData = async () => {
            // 6. Get access token
            const token = await getAccessToken();
            if (token) {
                // Fetching ID 794 (Bacon) and ID 3570 (Salmon/Fish) from generic base
                const baconResponse = await getFoodDetails("794", token);
                const fishResponse = await getFoodDetails("3570", token);

                // Populate state
                setBaconData(baconResponse);
                setFishData(fishResponse);

                // Logging 
                console.log("BVLTRA DATA A (BACON):", baconResponse);
                console.log("BVLTRA DATA B (FISH):", fishResponse);
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

            {/* HERO HEADER */}
            <div className="compare-hero" style={heroStyle}>
                <h1 className="compare-title">Statistics</h1>
                <div className="search-row">
                    <input type="text" className="pill-input" placeholder="Search Bacon..." />
                    <span className="compare-label">compare</span>
                    <input type="text" className="pill-input" placeholder="Search Fish..." />
                </div>
            </div>

            {/* 8. DATA ZONE (Replaces placeholders and implements Bootstrap layout) */}
            <Container className="pt-5 mt-4">
                {loading ? (
                    <div style={{ color: '#00ffcc', letterSpacing: '1px', textAlign: 'center', fontSize: '1.2rem' }}>INITIALIZING ENGINE / ANALYZING DATA...</div>
                ) : (
                    <><GlobalLegend />

                        <Row>
                            {/* Column 1 (Food A - Bacon) */}
                            <Col md={6} className="analysis-column">
                                {/* Render the specific frame component for Bacon */}
                                <FoodAnalysisFrame foodData={baconData} />
                            </Col>

                            {/* Column 2 (Food B - Fish) */}
                            <Col md={6} className="analysis-column">
                                {/* Render the specific frame component for Fish */}
                                <FoodAnalysisFrame foodData={fishData} />
                            </Col>
                        </Row></>
                )}
            </Container>
        </div>
    );
}

export default ComparePage;