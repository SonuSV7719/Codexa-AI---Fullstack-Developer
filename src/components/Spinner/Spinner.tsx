import React from 'react';
import './spinner.css';

interface SpinnerProps {
    size?: string; // Size of the spinner (e.g., '40px', '2rem')
    color?: string; // Color of the spinner border
    borderWidth?: string; // Width of the spinner border (e.g., '2px', '4px')
    speed?: string; // Rotation speed in seconds (e.g., '0.5s', '1s')
}

const Spinner: React.FC<SpinnerProps> = ({
    size = '40px',
    color = '#FFA500',
    borderWidth = '4px',
    speed = '1s',
}) => {
    return (
        <div
            className="spinner"
            role="status"
            aria-label="Loading..."
            style={{
                width: size,
                height: size,
                borderWidth: borderWidth,
                borderColor: `${color} transparent transparent transparent`,
                animationDuration: speed,
            }}
        ></div>
    );
};

export default Spinner;
