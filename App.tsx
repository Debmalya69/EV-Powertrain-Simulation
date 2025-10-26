import React, { useState, useCallback, useRef, useEffect } from 'react';
import { SectionCard } from './components/SectionCard';
import { ParameterSlider } from './components/ParameterSlider';
import { ResultsChart } from './components/ResultsChart';
import { SummaryMetrics } from './components/SummaryMetrics';
import { DRIVING_CYCLES, PHYSICAL_CONSTANTS, INITIAL_PARAMS } from './constants';
import type { SimulationParams, ChartDataPoint, SimulationResults, DrivingCycle } from './types';

const App: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>(INITIAL_PARAMS);
  const [selectedCycle, setSelectedCycle] = useState<DrivingCycle>(DRIVING_CYCLES[0]);
  const [simulationData, setSimulationData] = useState<ChartDataPoint[]>([]);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [simTimeDisplay, setSimTimeDisplay] = useState(0);
  
  const simulationInterval = useRef<number | null>(null);

  const handleParamChange = useCallback((param: keyof SimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [param]: value }));
  }, []);
  
  const stopSimulation = useCallback(() => {
    if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
    }
    setIsLoading(false);
  }, []);

  const startSimulation = useCallback(() => {
    // This simulation is based on a deterministic, physics-based model and runs entirely offline in the browser.
    // No AI or external services are used for the core calculations.
    setIsLoading(true);
    setSimulationData([]);
    setProgress(0);
    setSimTimeDisplay(0);
    setResults({
        totalDistance: 0,
        energyConsumed: 0,
        energyRegenerated: 0,
        avgEfficiency: 0,
        finalSOC: 100,
    });

    const simState = {
        simTime: 0, // seconds
        lastSpeedKmh: 0,
        soc: 100.0,
        totalDistance: 0, // km
        totalEnergyConsumed: 0, // kWh
        totalEnergyRegenerated: 0, // kWh
    };
    
    const cycleData = selectedCycle.data;
    const cycleDuration = cycleData[cycleData.length - 1].time; // in seconds
    const timeStep = 0.1; // Simulate 0.1 seconds of driving per tick
    const intervalDelay = 100; // Run a tick every 100ms for 1x real-time speed

    simulationInterval.current = window.setInterval(() => {
        if (simState.simTime >= cycleDuration) {
            setProgress(100);
            setSimTimeDisplay(cycleDuration);
            stopSimulation();
            return;
        }

        const nextPointIndex = cycleData.findIndex(p => p.time >= simState.simTime);
        const prevPointIndex = nextPointIndex > 0 ? nextPointIndex - 1 : 0;
        const prevPoint = cycleData[prevPointIndex];
        const nextPoint = cycleData[nextPointIndex] || prevPoint;

        let currentSpeedKmh;
        if (nextPoint.time === prevPoint.time || simState.simTime >= nextPoint.time) {
            currentSpeedKmh = nextPoint.speed;
        } else {
            const fraction = (simState.simTime - prevPoint.time) / (nextPoint.time - prevPoint.time);
            currentSpeedKmh = prevPoint.speed + fraction * (nextPoint.speed - prevPoint.speed);
        }
        
        const deltaT = timeStep;
        
        const v_mps = currentSpeedKmh / 3.6;
        const prev_v_mps = simState.lastSpeedKmh / 3.6;
        const acceleration = (v_mps - prev_v_mps) / deltaT;
        
        const F_drag = 0.5 * PHYSICAL_CONSTANTS.airDensity * params.frontalArea * PHYSICAL_CONSTANTS.dragCoefficient * v_mps * v_mps;
        const F_roll = PHYSICAL_CONSTANTS.rollingResistanceCoefficient * params.vehicleWeight * PHYSICAL_CONSTANTS.gravity;
        const F_inertia = params.vehicleWeight * acceleration;
        const F_total = F_drag + F_roll + F_inertia;

        const powerAtWheels = F_total * v_mps;
        let powerFromBattery = 0;

        if (powerAtWheels > 0) {
            powerFromBattery = powerAtWheels / (params.motorEfficiency / 100);
        } else {
            powerFromBattery = powerAtWheels * (params.regenEfficiency / 100);
        }

        const powerFromBatteryKw = Math.min(powerFromBattery / 1000, params.motorPower);
        const energyDeltaKwh = powerFromBatteryKw * (deltaT / 3600);

        if (energyDeltaKwh > 0) {
            simState.totalEnergyConsumed += energyDeltaKwh;
        } else {
            simState.totalEnergyRegenerated -= energyDeltaKwh;
        }
        
        const socDelta = (energyDeltaKwh / params.batteryCapacity) * 100;
        simState.soc = Math.max(0, simState.soc - socDelta);
        simState.totalDistance += (v_mps * deltaT) / 1000;

        setSimulationData(prev => [...prev, {
            time: simState.simTime / 60, // minutes
            speed: currentSpeedKmh,
            soc: parseFloat(simState.soc.toFixed(2)),
            power: parseFloat(powerFromBatteryKw.toFixed(2)),
        }]);
        
        const avgEfficiency = simState.totalDistance > 0 ? (simState.totalEnergyConsumed / simState.totalDistance) * 100 : 0;
        setResults({
            totalDistance: simState.totalDistance,
            energyConsumed: simState.totalEnergyConsumed,
            energyRegenerated: simState.totalEnergyRegenerated,
            avgEfficiency: avgEfficiency,
            finalSOC: simState.soc,
        });

        setProgress((simState.simTime / cycleDuration) * 100);
        setSimTimeDisplay(simState.simTime);
        simState.lastSpeedKmh = currentSpeedKmh;
        simState.simTime += timeStep;
    }, intervalDelay);
  }, [params, selectedCycle, stopSimulation]);

  const handleReset = useCallback(() => {
    stopSimulation();
    setParams(INITIAL_PARAMS);
    setSelectedCycle(DRIVING_CYCLES[0]);
    setSimulationData([]);
    setResults(null);
    setProgress(0);
    setSimTimeDisplay(0);
  }, [stopSimulation]);
  
  useEffect(() => {
    return () => stopSimulation();
  }, [stopSimulation]);

  return (
    <div className="min-h-screen bg-brand-background font-sans p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary tracking-tight">
          EV Powertrain Simulation
        </h1>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <SectionCard title="Simulation Parameters">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text/90 mb-2">Driving Cycle</label>
                    <select
                        value={selectedCycle.name}
                        onChange={(e) => setSelectedCycle(DRIVING_CYCLES.find(c => c.name === e.target.value) || DRIVING_CYCLES[0])}
                        disabled={isLoading}
                        className="w-full bg-brand-background border border-brand-secondary text-brand-text rounded-lg p-2 accent-brand-primary disabled:opacity-50"
                    >
                        {DRIVING_CYCLES.map(cycle => <option key={cycle.name}>{cycle.name}</option>)}
                    </select>
                </div>
              <ParameterSlider label="Battery Capacity" unit="kWh" value={params.batteryCapacity} min={10} max={120} step={1} onChange={(val) => handleParamChange('batteryCapacity', val)} />
              <ParameterSlider label="Motor Power" unit="kW" value={params.motorPower} min={20} max={500} step={10} onChange={(val) => handleParamChange('motorPower', val)} />
              <ParameterSlider label="Vehicle Weight" unit="kg" value={params.vehicleWeight} min={200} max={3000} step={50} onChange={(val) => handleParamChange('vehicleWeight', val)} />
              <ParameterSlider label="Frontal Area" unit="m²" value={params.frontalArea} min={0.5} max={3.5} step={0.1} onChange={(val) => handleParamChange('frontalArea', val)} />
              <ParameterSlider label="Motor Efficiency" unit="%" value={params.motorEfficiency} min={80} max={98} step={1} onChange={(val) => handleParamChange('motorEfficiency',val)} />
              <ParameterSlider label="Regen. Braking Efficiency" unit="%" value={params.regenEfficiency} min={0} max={90} step={5} onChange={(val) => handleParamChange('regenEfficiency', val)} />
            </div>
             <div className="mt-6">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-medium text-brand-text/90">Progress</span>
                    <span className="font-semibold text-brand-primary">{`${simTimeDisplay.toFixed(1)}s / ${selectedCycle.data[selectedCycle.data.length - 1].time}s`}</span>
                </div>
                <div className="w-full bg-brand-background rounded-full h-2.5">
                    <div
                    className="bg-brand-primary h-2.5 rounded-full"
                    style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
                    ></div>
                </div>
            </div>
            <div className="mt-6 space-y-3">
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={startSimulation}
                  disabled={isLoading}
                  className="w-1/2 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 bg-brand-primary hover:bg-teal-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Run Simulation
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isLoading}
                  className="w-1/2 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  Stop Simulation
                </button>
              </div>
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="w-full text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 bg-brand-secondary hover:bg-gray-600 disabled:bg-gray-700 disabled:cursor-not-allowed border border-gray-500"
              >
                Reset Parameters
              </button>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-3">
          <SectionCard title="Simulation Results">
            {simulationData.length > 0 || isLoading ? (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-brand-text/90 mb-2">Summary Metrics</h3>
                  <SummaryMetrics results={results} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-text/90 mb-2">Live Charts</h3>
                  <ResultsChart data={simulationData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-brand-text/70">
                <p className="text-lg">Adjust parameters and click "Run Simulation" to see performance data.</p>
              </div>
            )}
          </SectionCard>
        </div>
      </main>
    </div>
  );
};

export default App;