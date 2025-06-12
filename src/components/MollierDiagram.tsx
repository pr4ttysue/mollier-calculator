"use client";

import React from 'react';

interface Point {
  id: string;
  temperature: number;
  humidity: number;
  x: number;
  enthalpy: number;
}

interface MollierDiagramProps {
  points: Point[];
  settings: {
    temperatureMin: number;
    temperatureMax: number;
    humidityMin: number;
    humidityMax: number;
    showComfortZone: boolean;
    airDensity: number;
  };
}

export default function MollierDiagram({ points, settings }: MollierDiagramProps) {
  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 60, left: 80 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Функции для преобразования координат
  const xScale = (temp: number) => {
    return ((temp - settings.temperatureMin) / (settings.temperatureMax - settings.temperatureMin)) * chartWidth;
  };

  const yScale = (humidity: number) => {
    return chartHeight - ((humidity - settings.humidityMin) / (settings.humidityMax - settings.humidityMin)) * chartHeight;
  };

  // Генерация сетки
  const generateGridLines = () => {
    const lines: React.ReactElement[] = [];
    
    // Вертикальные линии (температура)
    for (let temp = settings.temperatureMin; temp <= settings.temperatureMax; temp += 5) {
      const x = xScale(temp);
      lines.push(
        <line
          key={`v-${temp}`}
          x1={x}
          y1={0}
          x2={x}
          y2={chartHeight}
          stroke={temp % 10 === 0 ? "#666" : "#ddd"}
          strokeWidth={temp % 10 === 0 ? 1 : 0.5}
        />
      );
    }

    // Горизонтальные линии (влагосодержание)
    for (let hum = settings.humidityMin; hum <= settings.humidityMax; hum += 2) {
      const y = yScale(hum);
      lines.push(
        <line
          key={`h-${hum}`}
          x1={0}
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke={hum % 5 === 0 ? "#666" : "#ddd"}
          strokeWidth={hum % 5 === 0 ? 1 : 0.5}
        />
      );
    }

    return lines;
  };

  // Генерация линий относительной влажности
  const generateHumidityLines = () => {
    const lines: React.ReactElement[] = [];
    const humidityLevels = [20, 40, 60, 80, 100];
    
    humidityLevels.forEach(rh => {
      const pathPoints = [];
      for (let temp = settings.temperatureMin; temp <= settings.temperatureMax; temp += 1) {
        // Упрощенный расчет влагосодержания для данной относительной влажности и температуры
        const satPressure = 611.2 * Math.exp(17.67 * temp / (temp + 243.5));
        const vaporPressure = (rh / 100) * satPressure;
        const x = 0.622 * vaporPressure / (101325 - vaporPressure) * 1000; // г/кг
        
        if (x >= settings.humidityMin && x <= settings.humidityMax) {
          const xPos = xScale(temp);
          const yPos = yScale(x);
          pathPoints.push(`${xPos},${yPos}`);
        }
      }
      
      if (pathPoints.length > 1) {
        lines.push(
          <polyline
            key={`rh-${rh}`}
            points={pathPoints.join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
        );
        
        // Подпись линии
        if (pathPoints.length > 0) {
          const [lastX, lastY] = pathPoints[pathPoints.length - 1].split(',').map(Number);
          lines.push(
            <text
              key={`rh-label-${rh}`}
              x={lastX + 5}
              y={lastY - 5}
              fontSize="10"
              fill="#3b82f6"
            >
              {rh}%
            </text>
          );
        }
      }
    });
    
    return lines;
  };

  // Зона комфорта
  const renderComfortZone = () => {
    if (!settings.showComfortZone) return null;
    
    return (
      <rect
        x={xScale(18)}
        y={yScale(12)}
        width={xScale(26) - xScale(18)}
        height={yScale(7) - yScale(12)}
        fill="rgba(34, 197, 94, 0.1)"
        stroke="rgba(34, 197, 94, 0.3)"
        strokeWidth={1}
        strokeDasharray="3,3"
      />
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Диаграмма Моллье</h3>
      
      <svg width={width} height={height} className="border border-gray-200">
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Сетка */}
          {generateGridLines()}
          
          {/* Линии относительной влажности */}
          {generateHumidityLines()}
          
          {/* Зона комфорта */}
          {renderComfortZone()}
          
          {/* Точки */}
          {points.map((point, index) => (
            <g key={point.id}>
              <circle
                cx={xScale(point.temperature)}
                cy={yScale(point.x)}
                r={6}
                fill="#ef4444"
                stroke="#ffffff"
                strokeWidth={2}
              />
              <text
                x={xScale(point.temperature) + 10}
                y={yScale(point.x) - 10}
                fontSize="12"
                fill="#374151"
                fontWeight="bold"
              >
                {point.id}
              </text>
            </g>
          ))}
          
          {/* Оси координат */}
          <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#000" strokeWidth={2} />
          <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#000" strokeWidth={2} />
          
          {/* Подписи осей */}
          <text
            x={chartWidth / 2}
            y={chartHeight + 40}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
          >
            Температура, °C
          </text>
          
          <text
            x={-chartHeight / 2}
            y={-50}
            textAnchor="middle"
            fontSize="14"
            fill="#374151"
            transform={`rotate(-90, -${chartHeight / 2}, -50)`}
          >
            Влагосодержание, г/кг
          </text>
          
          {/* Деления на осях */}
          {/* Ось X (температура) */}
          {Array.from({ length: Math.floor((settings.temperatureMax - settings.temperatureMin) / 10) + 1 }, (_, i) => {
            const temp = settings.temperatureMin + i * 10;
            const x = xScale(temp);
            return (
              <g key={`x-tick-${temp}`}>
                <line x1={x} y1={chartHeight} x2={x} y2={chartHeight + 5} stroke="#000" strokeWidth={1} />
                <text x={x} y={chartHeight + 20} textAnchor="middle" fontSize="12" fill="#374151">
                  {temp}
                </text>
              </g>
            );
          })}
          
          {/* Ось Y (влагосодержание) */}
          {Array.from({ length: Math.floor((settings.humidityMax - settings.humidityMin) / 5) + 1 }, (_, i) => {
            const hum = settings.humidityMin + i * 5;
            const y = yScale(hum);
            return (
              <g key={`y-tick-${hum}`}>
                <line x1={-5} y1={y} x2={0} y2={y} stroke="#000" strokeWidth={1} />
                <text x={-10} y={y + 4} textAnchor="end" fontSize="12" fill="#374151">
                  {hum}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Легенда */}
      <div className="mt-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Легенда:</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Расчетные точки</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500" style={{borderTop: '1px dashed'}}></div>
            <span>Линии относительной влажности (%)</span>
          </div>
          {settings.showComfortZone && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 opacity-20 border border-green-500"></div>
              <span>Зона комфорта</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 