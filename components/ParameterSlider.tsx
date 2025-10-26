
import React from 'react';

interface ParameterSliderProps {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export const ParameterSlider: React.FC<ParameterSliderProps> = ({ label, unit, value, min, max, step, onChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-brand-text/90">{label}</label>
        <span className="text-sm font-semibold text-brand-primary bg-brand-background px-2 py-1 rounded">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-brand-background rounded-lg appearance-none cursor-pointer accent-brand-primary"
      />
    </div>
  );
};
