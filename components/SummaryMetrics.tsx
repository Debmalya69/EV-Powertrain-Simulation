import React from 'react';
import type { SimulationResults } from '../types';

const MetricDisplay: React.FC<{ label: string; value: string; unit: string; }> = ({ label, value, unit }) => (
    <div className="flex flex-col items-center justify-center p-4 bg-brand-background/50 rounded-lg text-center h-full">
        <span className="text-sm text-brand-text/70">{label}</span>
        <span className="text-2xl font-bold text-brand-primary">{value}</span>
        <span className="text-xs text-brand-text/60">{unit}</span>
    </div>
);

export const SummaryMetrics: React.FC<{ results: SimulationResults | null }> = ({ results }) => {
    if (!results) {
        return (
             <div className="text-center py-8 text-brand-text/70">
                <p>Run a simulation to see summary metrics.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <MetricDisplay label="Total Distance" value={results.totalDistance.toFixed(1)} unit="km" />
            <MetricDisplay label="Avg. Efficiency" value={results.avgEfficiency.toFixed(1)} unit="kWh/100km" />
            <MetricDisplay label="Energy Consumed" value={results.energyConsumed.toFixed(2)} unit="kWh" />
            <MetricDisplay label="Energy Regenerated" value={results.energyRegenerated.toFixed(2)} unit="kWh" />
            <MetricDisplay label="Final SoC" value={results.finalSOC.toFixed(1)} unit="%" />
        </div>
    );
}
