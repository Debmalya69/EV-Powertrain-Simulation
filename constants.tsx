import React from 'react';
import type { DrivingCycle, SimulationParams } from './types';

export const PHYSICAL_CONSTANTS = {
  gravity: 9.81, // m/s^2
  airDensity: 1.225, // kg/m^3
  dragCoefficient: 0.28,
  rollingResistanceCoefficient: 0.012,
};

export const INITIAL_PARAMS: SimulationParams = {
  batteryCapacity: 75,
  motorPower: 250,
  vehicleWeight: 1800,
  regenEfficiency: 60,
  motorEfficiency: 90,
  frontalArea: 2.2,
};

// More detailed and realistic standard driving cycles
export const DRIVING_CYCLES: DrivingCycle[] = [
  {
    name: "Urban (UDDS)",
    data: [
      { time: 0, speed: 0 }, { time: 5, speed: 15 }, { time: 10, speed: 25 }, { time: 17, speed: 41 }, 
      { time: 26, speed: 40 }, { time: 34, speed: 20 }, { time: 38, speed: 0 }, { time: 51, speed: 0 }, 
      { time: 55, speed: 20 }, { time: 60, speed: 32 }, { time: 65, speed: 40 }, { time: 85, speed: 45 }, 
      { time: 91, speed: 24 }, { time: 96, speed: 0 }, { time: 108, speed: 0 }, { time: 112, speed: 25 }, 
      { time: 120, speed: 45 }, { time: 130, speed: 50 }, { time: 140, speed: 48 }, { time: 150, speed: 32 }, 
      { time: 155, speed: 0 }, { time: 165, speed: 0 }, { time: 170, speed: 28 }, { time: 178, speed: 42 }, 
      { time: 195, speed: 45 }, { time: 205, speed: 30 }, { time: 210, speed: 10 }, { time: 215, speed: 0 }, 
      { time: 240, speed: 0 }
    ],
  },
  {
    name: "Highway (HWFET)",
    data: [
      { time: 0, speed: 0 }, { time: 10, speed: 40 }, { time: 16, speed: 77 }, { time: 30, speed: 85 }, 
      { time: 40, speed: 90 }, { time: 50, speed: 92 }, { time: 60, speed: 95 }, { time: 80, speed: 98 }, 
      { time: 100, speed: 97 }, { time: 120, speed: 95 }, { time: 130, speed: 80 }, { time: 140, speed: 88 }, 
      { time: 150, speed: 92 }, { time: 160, speed: 96 }, { time: 180, speed: 100 }, { time: 200, speed: 98 }, 
      { time: 210, speed: 85 }, { time: 220, speed: 70 }, { time: 230, speed: 75 }, { time: 240, speed: 60 }
    ],
  },
];