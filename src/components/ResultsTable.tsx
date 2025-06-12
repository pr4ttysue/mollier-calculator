"use client";

import React from 'react';

interface Point {
  tdb: number;      // температура сухого термометра
  twb: number;      // температура влажного термометра
  tdew: number;     // точка росы
  x: number;        // влагосодержание
  h: number;        // энтальпия
  rh: number;       // относительная влажность
  pv: number;       // давление паров
  density: number;  // плотность
  airFlow: number;  // поток воздуха
}

interface Process {
  type: string;
  startPointIndex: number;
  endPointIndex: number;
  parameters: Record<string, number>;
  deltaT?: number;
  deltaX?: number;
  deltaXL?: number;
  deltaH?: number;
  powerH?: number;
  powerT?: number;
}

interface ResultsTableProps {
  points: Point[];
  processes: Process[];
  onDeleteProcess?: (index: number) => void;
}

// Получение цвета для процесса
const getProcessColor = (type: string) => {
  switch (type) {
    case 'Heat': return '#EF4444';
    case 'Cool': return '#3B82F6';
    case 'Humidity': return '#14B8A6';
    case 'Mix': return '#10B981';
    case 'HeatRecovery': return '#8B5CF6';
    default: return '#6B7280';
  }
};

// Получение названия процесса на русском
const getProcessLabel = (type: string) => {
  switch (type) {
    case 'Heat': return 'Нагрев';
    case 'Cool': return 'Охлаждение';
    case 'Mix': return 'Смешение';
    case 'Humidity': return 'Увлажнение';
    case 'HeatRecovery': return 'Рекуперация';
    case 'CustomPoint': return 'Точка';
    default: return type;
  }
};

const getProcessDisplayName = (process: Process): string => {
  const processNames = {
    'heating': 'Нагрев',
    'cooling': 'Охлаждение',
    'humidification': 'Увлажнение',
    'dehumidification': 'Осушение',
    'mixing': 'Смешение'
  };
  
  return processNames[process.type] || process.type;
};

export default function ResultsTable({ points, processes, onDeleteProcess }: ResultsTableProps) {
  // Данные о точках
  const pointsData = points.map((point, index) => ({
    index,
    ...point
  }));
  
  // Данные о процессах
  const processesData = processes.map((process: Process, index: number) => {
    const startPoint = points[process.startPointIndex];
    const endPoint = points[process.endPointIndex];
    
    if (!startPoint || !endPoint) return null;
    
    const deltaT = process.deltaT || (endPoint.tdb - startPoint.tdb);
    const deltaX = process.deltaX || (endPoint.x - startPoint.x);
    const deltaH = process.deltaH || (endPoint.h - startPoint.h);
    const power = process.powerH || 0;
    
    return {
      index,
      label: `Точка ${process.startPointIndex + 1} → ${process.endPointIndex + 1}`,
      type: process.type,
      startPoint: process.startPointIndex,
      endPoint: process.endPointIndex,
      deltaT,
      deltaX,
      deltaH,
      power,
      color: getProcessColor(process.type)
    };
  }).filter(Boolean) as any[];
  
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Параметры точек</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[80px]">
                  Точка
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  T сух., °C
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  T влаж., °C
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  T росы, °C
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                  Влагосод., г/кг
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                  Энтальпия, кДж/кг
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                  Влажность, %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {pointsData.map((point) => (
                <tr key={`point-${point.index}`} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                      {point.index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {point.tdb.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {point.twb.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {point.tdew.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {point.x.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {point.h.toFixed(1)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                    {point.rh.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Таблица параметров процессов */}
      {processesData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Параметры процессов</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Процесс
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Тип
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                    ΔT, °C
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Δx, г/кг
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Δh, кДж/кг
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Мощность, кВт
                  </th>
                  {onDeleteProcess && (
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px]">
                      Действия
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {processesData.map((process) => (
                  <tr key={`process-${process.index}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {process.label}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span 
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: process.color }}
                      >
                        {getProcessLabel(process.type)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {process.deltaT > 0 ? '+' : ''}{process.deltaT.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {process.deltaX > 0 ? '+' : ''}{process.deltaX.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {process.deltaH > 0 ? '+' : ''}{process.deltaH.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {process.power.toFixed(1)}
                    </td>
                    {onDeleteProcess && (
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => onDeleteProcess(process.index)}
                          className="inline-flex items-center justify-center w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors"
                          title="Удалить процесс"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 