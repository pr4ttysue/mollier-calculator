"use client";

import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Point {
  tdb: number;
  twb: number;
  tdew: number;
  x: number;
  h: number;
  rh: number;
  pv: number;
  density: number;
  airFlow: number;
}

interface Process {
  type: string;
  startPointIndex: number;
  endPointIndex: number;
  parameters: Record<string, number>;
  deltaT?: number;
  deltaX?: number;
  deltaH?: number;
  powerH?: number;
}

interface ChartSettings {
  humidityMin: number;
  humidityMax: number;
  temperatureMin: number;
  temperatureMax: number;
  showComfortZone: boolean;
  airDensity: number;
}

interface MollierChartProps {
  points: Point[];
  processes: Process[];
  settings: ChartSettings;
}

interface ChartDataPoint {
  tdb: number;
  x: number;
  rh: number;
  h: number;
  pointIndex: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartDataPoint }>;
  label?: string;
}

// Компонент подсказки
const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-lg text-xs">
        <p className="font-semibold text-gray-800">Точка {data.pointIndex}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
          <div className="text-gray-600">Температура:</div>
          <div className="font-medium">{data.tdb.toFixed(1)} °C</div>
          
          <div className="text-gray-600">Влажность:</div>
          <div className="font-medium">{data.rh.toFixed(1)} %</div>
          
          <div className="text-gray-600">Влагосодержание:</div>
          <div className="font-medium">{data.x.toFixed(1)} г/кг</div>
          
          <div className="text-gray-600">Энтальпия:</div>
          <div className="font-medium">{data.h.toFixed(1)} кДж/кг</div>
        </div>
      </div>
    );
  }
  return null;
};

const MollierChart: React.FC<{
  points: Point[];
  settings: ChartSettings;
  onPointClick?: (point: Point) => void;
}> = ({ points, settings, onPointClick }) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [saturationLine, setSaturationLine] = useState<Array<{ tdb: number; x: number }>>([]);
  const [rhLines, setRhLines] = useState<Array<{ rh: number; points: Array<{ tdb: number; x: number }> }>>([]);

  // Генерируем данные для диаграммы
  useEffect(() => {
    const data = points.map((point, index) => ({
      tdb: point.tdb,
      x: point.x,
      rh: point.rh,
      h: point.h,
      pointIndex: index + 1
    }));
    
    setChartData(data);
  }, [points]);

  // Генерируем линию насыщения (100% влажности)
  useEffect(() => {
    const satLine = [];
    for (let t = settings.temperatureMin; t <= settings.temperatureMax; t += 1) {
      // Расчет влагосодержания при 100% влажности
      const pws = 610.78 * Math.exp((17.2694 * t) / (t + 238.3));
      const x = (0.622 * pws) / (101325 - pws) * 1000; // г/кг
      
      if (x >= settings.humidityMin && x <= settings.humidityMax) {
        satLine.push({ tdb: t, x });
      }
    }
    setSaturationLine(satLine);
  }, [settings]);

  // Генерируем линии относительной влажности
  useEffect(() => {
    const rhValues = [20, 40, 60, 80];
    const newRhLines = rhValues.map(rh => {
      const points = [];
      for (let t = settings.temperatureMin; t <= settings.temperatureMax; t += 2) {
        const pws = 610.78 * Math.exp((17.2694 * t) / (t + 238.3));
        const pv = (rh / 100) * pws;
        const x = (0.622 * pv) / (101325 - pv) * 1000;
        
        if (x >= settings.humidityMin && x <= settings.humidityMax) {
          points.push({ tdb: t, x });
        }
      }
      return { rh, points };
    });
    
    setRhLines(newRhLines);
  }, [settings]);

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 30,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="tdb" 
            name="Температура"
            unit="°C"
            domain={[settings.temperatureMin, settings.temperatureMax]}
            label={{ value: 'Температура (°C)', position: 'insideBottom', offset: -20 }}
          />
          <YAxis 
            type="number" 
            dataKey="x" 
            name="Влагосодержание"
            unit="г/кг"
            domain={[settings.humidityMin, settings.humidityMax]}
            label={{ value: 'Влагосодержание (г/кг)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Линия насыщения */}
          <Scatter
            name="Линия насыщения (100% RH)"
            data={saturationLine}
            line={{ stroke: '#ef4444', strokeWidth: 2 }}
            shape={() => <></>}
          />
          
          {/* Линии относительной влажности */}
          {rhLines.map((rhLine) => (
            <Scatter
              key={`rh-${rhLine.rh}`}
              name={`${rhLine.rh}% RH`}
              data={rhLine.points}
              line={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '5 5' }}
              shape={() => <></>}
            />
          ))}
          
          {/* Точки состояний */}
          <Scatter
            name="Состояния воздуха"
            data={chartData}
            fill="#1e40af"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MollierChart; 