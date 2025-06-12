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

interface AirStartConditionsProps {
  point: Point;
  onPointChange: (field: string, value: number) => void;
}

export default function AirStartConditions({ point, onPointChange }: AirStartConditionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Начальные условия воздуха</h3>
      
      {/* Высота */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium text-gray-700 min-w-[100px]">
          Высота над уровнем моря:
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={0}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100"
            readOnly
          />
          <span className="text-sm text-gray-600">м</span>
        </div>
      </div>
      
      {/* Основные параметры */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Температура сухого термометра, °C:
          </label>
          <input
            type="number"
            value={point.tdb}
            onChange={(e) => onPointChange('tdb', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="25.0"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Относительная влажность, %:
          </label>
          <input
            type="number"
            value={point.rh}
            onChange={(e) => onPointChange('rh', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50.0"
            min="0"
            max="100"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Расход воздуха, м³/ч:
          </label>
          <input
            type="number"
            value={point.airFlow}
            onChange={(e) => onPointChange('airFlow', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1000"
            min="0"
          />
        </div>
      </div>
      
      {/* Рассчитанные параметры */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-md font-semibold text-blue-900 mb-3">
          Рассчитанные параметры:
        </h4>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Температура влажного термометра
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.twb.toFixed(1)} °C
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Температура точки росы
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.tdew.toFixed(1)} °C
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Влагосодержание
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.x.toFixed(2)} г/кг
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Энтальпия
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.h.toFixed(1)} кДж/кг
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Плотность воздуха
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.density.toFixed(3)} кг/м³
            </span>
          </div>
          
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-blue-700 font-medium uppercase tracking-wide">
              Давление паров
            </span>
            <span className="text-sm font-semibold text-blue-900">
              {point.pv.toFixed(0)} Па
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 