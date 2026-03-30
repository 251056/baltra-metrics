import React, { useState } from 'react';

// Inactive state
const inactiveStyle = {
  background: 'transparent',
  text: '#888',
  border: '#333'
};

// The HoverButton component is a reusable button that visually indicates its active state through color changes and hover effects. It accepts props for the metric name, whether it is currently active, the color to use when active, and an onClick handler. The button's style dynamically adjusts based on its active and hover states.
const HoverButton = ({ metric, isActive, activeColor, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isActive ? activeColor : inactiveStyle.background,
        color: isActive ? '#000' : (isHovered ? activeColor : inactiveStyle.text),
        border: `1px solid ${isActive || isHovered ? activeColor : inactiveStyle.border}`,
        padding: '8px 20px',
        borderRadius: '20px',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        fontWeight: isActive ? 'bold' : 'normal',
        boxShadow: isActive 
        // When active, the button has a sublte glow effect using the active color with 50% opacity. When hovered (but not active), it has a subtler glow with 25% opacity. If neither active nor hovered, there is no shadow.
          ? `0 0 15px ${activeColor}80` 
          : (isHovered ? `0 0 10px ${activeColor}40` : 'none'),
        transform: isHovered && !isActive ? 'translateY(-2px)' : 'none'
      }}
    >
      {metric.toUpperCase()}
    </button>
  );
};

export default HoverButton;