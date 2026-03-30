/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */

// The GlobalLegend component is a simple visual guide that explains the color coding used in the line graph. Each color corresponds to a specific macronutrient (Carbohydrate, Fat, Protein), allowing users to quickly understand which line represents which metric when they view the graph. The legend is styled to be clear and visually consistent with the overall design of the application.
const GlobalLegend = () => (
    <div style={{
        display: 'flex', gap: '20px', fontFamily: '"Courier New", monospace',
        fontSize: '0.85rem', color: '#eee', marginBottom: '20px', marginLeft: '35px' //Left margin to align with the graph's border radius
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

export default GlobalLegend;