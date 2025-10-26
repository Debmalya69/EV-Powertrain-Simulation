import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { ChartDataPoint } from '../types';

interface ResultsChartProps {
  data: ChartDataPoint[];
}

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-brand-secondary border border-brand-primary/50 rounded-lg shadow-lg text-sm">
        <p className="label text-brand-text/80">{`Time : ${label.toFixed(2)} min`}</p>
        {payload.map((pld: any) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>{`${pld.name} : ${pld.value.toFixed(2)} ${pld.unit}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export const ResultsChart: React.FC<ResultsChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[750px] space-y-8 mt-4">
      <div>
        <h3 className="text-lg font-semibold text-center mb-2 text-brand-text/90">Vehicle Speed vs. Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ADB5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE20" />
            <XAxis dataKey="time" unit=" min" stroke="#EEEEEE" fontSize={12}/>
            <YAxis unit=" km/h" stroke="#EEEEEE" fontSize={12}/>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="speed" stroke="#00ADB5" fillOpacity={1} fill="url(#colorSpeed)" name="Speed" unit="km/h" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-center mb-2 text-brand-text/90">Battery State of Charge (SoC) vs. Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorSoc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ADB5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00ADB5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE20" />
            <XAxis dataKey="time" unit=" min" stroke="#EEEEEE" fontSize={12}/>
            <YAxis domain={[dataMin => (Math.floor(dataMin / 10) * 10), 100]} unit="%" stroke="#EEEEEE" fontSize={12}/>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="soc" stroke="#00ADB5" fillOpacity={1} fill="url(#colorSoc)" name="SoC" unit="%" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-center mb-2 text-brand-text/90">Power vs. Time</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEEEEE20" />
            <XAxis dataKey="time" unit=" min" stroke="#EEEEEE" fontSize={12}/>
            <YAxis unit=" kW" stroke="#EEEEEE" fontSize={12}/>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="power" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPower)" name="Power (Consumption > 0, Regen < 0)" unit="kW" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};