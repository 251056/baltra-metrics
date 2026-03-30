import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { getSearchHistory } from './services/telemetry';
import bgImage from './assets/hero-header-timeline.jpg';
import './ComparePage.css';

// Components
import LineGraph from './components/LineGraph';
import HoverButton from './components/HoverButton'; 

// --- MASTER COLOR CONFIGURATION ---
const colorPalette = {
  Calories: '#00ffcc', // Cyan/Green
  Protein: '#B93234',  // Red
  Carbs: '#106C93',    // Blue
  Fat: '#CA7F14',      // Yellow
  Sugar: '#BE4571'     // Pink
};

// --- THE PAGE COMPONENT ---
function TimelinePage() {
  const [activeMetric, setActiveMetric] = useState('Calories');
  const [historicalData, setHistoricalData] = useState([]);

  // On page load, pull the search history from localStorage and reverse it to show the most recent first
  useEffect(() => {
    const history = getSearchHistory().reverse();
    setHistoricalData(history);
  }, []);

  const metricsList = ['Calories', 'Protein', 'Carbs', 'Fat', 'Sugar'];

  // Hero section style with background image and overlay
  const heroStyle = {
    backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, #050505 100%), url(${bgImage})`
  };

  return (
    <div className="compare-container">
      <div className="compare-hero" style={heroStyle}>
        <h1 className="compare-title" style={{ marginBottom: '20px' }}>Nutrition History</h1>
        <p style={{ color: '#00ffcc', fontFamily: '"Courier New", monospace', letterSpacing: '3px', marginTop: '10px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
          Recent Intake History
        </p>
      </div>

      <Container className="mt-2">
        <hr style={{ borderColor: '#333', borderWidth: '1px', opacity: 1, marginBottom: '40px' }} />

        {/* Metric Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {metricsList.map(metric => (
            <HoverButton 
              key={metric}
              metric={metric}
              isActive={activeMetric === metric}
              activeColor={colorPalette[metric]}
              onClick={() => setActiveMetric(metric)}
            />
          ))}
        </div>

        {/* Graph Container */}
        <div className="radar-frame" style={{ height: '500px', width: '100%', padding: '20px', backgroundColor: '#0a0a0a', border: '1px solid #222', borderRadius: '35px' }}>
          <LineGraph
            historicalData={historicalData}
            activeMetric={activeMetric}
            activeColor={colorPalette[activeMetric]}
          />
        </div>
      </Container>
    </div>
  );
}

export default TimelinePage;