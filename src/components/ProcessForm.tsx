"use client";

import React, { useState, useEffect } from 'react';

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

interface ProcessFormProps {
  process: Process;
  onProcessChange: (process: Process) => void;
  availablePoints: { value: number; label: string }[];
}

// Получение названия процесса на английском
const getProcessLabel = (type: string) => {
  switch (type) {
    case 'Heat': return 'Heat';
    case 'Cool': return 'Cool';
    case 'Mix': return 'Mix';
    case 'Humidity': return 'Humidify';
    case 'HeatRecovery': return 'Heat recovery';
    case 'CustomPoint': return 'Custom Point';
    default: return type;
  }
};

// Получение параметров для процесса в зависимости от типа
const getProcessParameterFields = (type: string) => {
  switch (type) {
    case 'Heat':
      return [
        { name: 'efficiency', label: 'Efficiency (%)', min: 0, max: 100, step: 1 },
        { name: 'power', label: 'Power (kW)', min: 0, max: 1000, step: 0.1 }
      ];
    case 'Cool':
      return [
        { name: 'efficiency', label: 'Efficiency (%)', min: 0, max: 100, step: 1 },
        { name: 'power', label: 'Power (kW)', min: 0, max: 1000, step: 0.1 },
        { name: 'bypass', label: 'Bypass Factor (%)', min: 0, max: 100, step: 1 }
      ];
    case 'Humidity':
      return [
        { name: 'efficiency', label: 'Efficiency (%)', min: 0, max: 100, step: 1 },
        { name: 'waterTemp', label: 'Water Temp (°C)', min: 0, max: 100, step: 0.1 }
      ];
    case 'Mix':
      return [
        { name: 'ratio', label: 'Mixing Ratio (%)', min: 0, max: 100, step: 1 },
        { name: 'secondaryFlow', label: 'Secondary Flow (m³/h)', min: 0, max: 100000, step: 100 }
      ];
    case 'HeatRecovery':
      return [
        { name: 'efficiency', label: 'Efficiency (%)', min: 0, max: 100, step: 1 },
        { name: 'secondaryTdb', label: 'Secondary Tdb (°C)', min: -50, max: 50, step: 0.1 },
        { name: 'secondaryRH', label: 'Secondary RH (%)', min: 0, max: 100, step: 1 }
      ];
    case 'CustomPoint':
      return [
        { name: 'targetTdb', label: 'Target Tdb (°C)', min: -50, max: 50, step: 0.1 },
        { name: 'targetRH', label: 'Target RH (%)', min: 0, max: 100, step: 1 }
      ];
    default:
      return [];
  }
};

const ProcessForm: React.FC<{
  process: Process;
  onUpdate: (updatedProcess: Process) => void;
  onDelete: (processId: string) => void;
}> = ({ process, onUpdate, onDelete }) => {
  const [startPoint, setStartPoint] = useState<number>(process.startPointIndex);
  const [endPoint, setEndPoint] = useState<number>(process.endPointIndex);
  const [parameters, setParameters] = useState<Record<string, number>>(process.parameters || {});
  
  // Обновление формы при изменении пропсов
  useEffect(() => {
    setStartPoint(process.startPointIndex);
    setEndPoint(process.endPointIndex);
    setParameters(process.parameters || {});
  }, [process]);
  
  // Обработчик изменения начальной и конечной точки
  const handlePointChange = (type: 'start' | 'end', value: number) => {
    if (type === 'start') {
      setStartPoint(value);
      onUpdate({
        ...process,
        startPointIndex: value,
      });
    } else {
      setEndPoint(value);
      onUpdate({
        ...process,
        endPointIndex: value,
      });
    }
  };
  
  // Обработчик изменения параметров процесса
  const handleParameterChange = (name: string, value: number) => {
    const updatedParameters = {
      ...parameters,
      [name]: value
    };
    
    setParameters(updatedParameters);
    onUpdate({
      ...process,
      parameters: updatedParameters
    });
  };
  
  // Получаем поля для текущего типа процесса
  const parameterFields = getProcessParameterFields(process.type);
  
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-700 mb-2">
          Edit {getProcessLabel(process.type)} Process
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Point
          </label>
          <select
            value={startPoint}
            onChange={(e) => handlePointChange('start', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {availablePoints.map((point) => (
              <option key={`start-${point.value}`} value={point.value}>
                {point.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Point
          </label>
          <select
            value={endPoint}
            onChange={(e) => handlePointChange('end', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {availablePoints.map((point) => (
              <option key={`end-${point.value}`} value={point.value}>
                {point.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Параметры процесса */}
      {parameterFields.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Process Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parameterFields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  {field.label}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={parameters[field.name] || 0}
                    onChange={(e) => handleParameterChange(field.name, parseFloat(e.target.value))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        {process.type === 'Heat' && (
          <p>The end point temperature will increase according to the specified power.</p>
        )}
        {process.type === 'Cool' && (
          <p>The end point temperature and humidity will decrease according to the specified parameters.</p>
        )}
        {process.type === 'Humidity' && (
          <p>The end point humidity will increase according to the specified parameters.</p>
        )}
        {process.type === 'Mix' && (
          <p>The end point represents the mixed air condition between start point and secondary air.</p>
        )}
        {process.type === 'HeatRecovery' && (
          <p>Heat transfer occurs between start point air and the secondary air conditions.</p>
        )}
        {process.type === 'CustomPoint' && (
          <p>Manually set the end point temperature and humidity to create a custom process.</p>
        )}
      </div>
    </div>
  );
} 