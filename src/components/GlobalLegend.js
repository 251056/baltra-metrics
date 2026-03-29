const GlobalLegend = () => (
    <div style={{
        display: 'flex', gap: '20px', fontFamily: '"Courier New", monospace',
        fontSize: '0.85rem', color: '#eee', marginBottom: '30px'
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