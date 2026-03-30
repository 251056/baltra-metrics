/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

// This component is responsible for rendering the radar chart that visualizes the micronutrient profile of a food item. It takes in the raw food data, normalizes the values to a percentage of daily value, and then configures the radar chart accordingly. The chart focuses on key micronutrients [Calcium, Potassium, Iron, Sodium, Vitamin A, and Vitamin C]. The component also includes a footnote to clarify that the values are scaled to %DV, ensuring transparency and aiding user interpretation.

const MicronutrientFrame = ({ foodData }) => {
  if (!foodData) return null;
  const serving = foodData.servings?.serving?.[0] || foodData.servings?.serving;
  if (!serving) return null;

  // --- MATH (Normalizing to 100g) ---
  const originalWeight = parseFloat(serving.metric_serving_amount);
  const ratio = (originalWeight && originalWeight > 0) ? (100 / originalWeight) : 1;

  const scale = (val, decimals = 1) => {
    if (!val || val === '-' || val === '< 1') return 0;
    return (parseFloat(val) * ratio).toFixed(decimals);
  };

  // Get raw %DV for the minerals that are already percentages
  const scaledCalcium = scale(serving.calcium);
  const scaledIron = scale(serving.iron);
  const scaledVitA = scale(serving.vitamin_a);
  const scaledVitC = scale(serving.vitamin_c);

  // Get mg for Sodium and Potassium
  const rawSodium = parseFloat(scale(serving.sodium, 2));
  const rawPotassium = parseFloat(scale(serving.potassium, 2));

  // PERCENTAGE CONVERSION
  // NOTE: Sodium limit: ~2300mg | Potassium limit: ~4700mg
  const percentSodium = rawSodium > 0 ? ((rawSodium / 2300) * 100).toFixed(1) : 0;
  const percentPotassium = rawPotassium > 0 ? ((rawPotassium / 4700) * 100).toFixed(1) : 0;

  // --- RADAR CHART LOGIC ---
  const radarChartData = {
    // %DV
    labels: ['Calcium', 'Pot.', 'Iron', 'Sodium', 'Vit A', 'Vit C'],
    datasets: [{
      label: '% of Daily Value',
      data: [scaledCalcium, percentPotassium, scaledIron, percentSodium, scaledVitA, scaledVitC],
      backgroundColor: 'rgba(0, 255, 204, 0.1)', 
      borderColor: 'rgba(0, 255, 204, 0.8)',
      pointBackgroundColor: '#00ffcc',
      pointBorderColor: '#050505',
      borderWidth: 1,
    }]
  };

const radarChartOptions = {
    layout: {
      padding: 20 
    },
    plugins: { legend: { display: false } },
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#ccc', font: { family: '"Courier New", monospace', size: 12 } },
        
        ticks: {
          display: true, 
          color: '#7c7c7c', 
          backdropColor: 'transparent', 
          font: { family: '"Courier New", monospace', size: 13, weight: 'bold' },
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="radar-frame">
      <h3 className="radar-title">
        MICRONUTRIENTS
      </h3>
      
      <div style={{ width: '100%', maxWidth: '450px', height: '350px', margin: '0 auto' }}>
        <Radar data={radarChartData} options={radarChartOptions} />
      </div>

      {/* FOOTNOTE */}
      <p style={{
        color: '#666',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.8rem',
        textAlign: 'center',
        marginTop: '20px',
        marginBottom: '0',
        letterSpacing: '0.5px'
      }}>
        *Values scaled to Percentage of Daily Value (%DV)
      </p>
    </div>
  );
};

export default MicronutrientFrame;