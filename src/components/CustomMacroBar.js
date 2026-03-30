import React from 'react';

const CustomMacroBar = ({ protein, carbs, fat }) => {
    // Math: Calculate total weight to find percentages
    const totalMacros = Number(protein) + Number(carbs) + Number(fat);
    
    // Avoid dividing by zero or a black hole will open and consume the universe
    if (totalMacros === 0) {
        return <div style={{ color: '#666', fontFamily: '"Courier New", monospace' }}>No macro data, awaiting input...</div>;
    }

    // Calculate exact percentages
    const proteinPct = ((protein / totalMacros) * 100).toFixed(1);
    const carbsPct = ((carbs / totalMacros) * 100).toFixed(1);
    const fatPct = ((fat / totalMacros) * 100).toFixed(1);

    // Color Palette
    const colors = {
        protein: 'rgba(185, 50, 52, 1)',   // Red
        carbs: 'rgba(16, 108, 147, 1)',    // Blue
        fat: 'rgba(202, 126, 20, 1)'       // Yellow
    };

    return (
        <div style={{ margin: '20px 0', fontFamily: '"Courier New", monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
                <span>MACRO DENSITY MAP</span>
                <span>100% MASS</span>
            </div>

            {/* --- THE CUSTOM VISUALIZATION (HTML/CSS) --- */}
            <div style={{ 
                display: 'flex', 
                width: '100%', 
                height: '24px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '12px',
                overflow: 'hidden', // Keeps the inner bars clamped to the rounded corners
                border: '1px solid #333'
            }}>
                {/* Protein Bar (Not the food, the segment)*/}
                <div style={{ 
                    width: `${proteinPct}%`, 
                    backgroundColor: colors.protein, 
                    transition: 'width 0.5s ease-in-out' 
                }} title={`Protein: ${proteinPct}%`} />
                
                {/* Carbs Bar */}
                <div style={{ 
                    width: `${carbsPct}%`, 
                    backgroundColor: colors.carbs, 
                    transition: 'width 0.5s ease-in-out' 
                }} title={`Carbs: ${carbsPct}%`} />
                
                {/* Fat Bar */}
                <div style={{ 
                    width: `${fatPct}%`, 
                    backgroundColor: colors.fat, 
                    transition: 'width 0.5s ease-in-out' 
                }} title={`Fat: ${fatPct}%`} />
            </div>

            {/* The Custom Legend */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                <span style={{ color: colors.protein }}>PROTEIN {proteinPct}%</span>
                <span style={{ color: colors.carbs }}>CARBS {carbsPct}%</span>
                <span style={{ color: colors.fat }}>FAT {fatPct}%</span>
            </div>
        </div>
    );
};

export default CustomMacroBar;