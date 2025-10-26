export type DrivingCycle = {
  name: string;
  data: { time: number; speed: number }[]; // time in s, speed in km/h
};

export interface SimulationParams {
  batteryCapacity: number; // kWh
  motorPower: number; // kW
  vehicleWeight: number; // kg
  regenEfficiency: number; // %
  motorEfficiency: number; // %
  frontalArea: number; // m^2
}

export interface ChartDataPoint {
  time: number; // minutes
  speed: number; // km/h
  soc: number; // %
  power: number; // kW
}

export interface SimulationResults {
  totalDistance: number; // km
  energyConsumed: number; // kWh
  energyRegenerated: number; // kWh
  avgEfficiency: number; // kWh/100km
  finalSOC: number; // %
}
