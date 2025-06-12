"use client";

import React, { useState } from 'react';

interface ProcessTypeSelectorProps {
  onAddProcess: (type: string, paramType: string, paramValue: number) => void;
}

export default function ProcessTypeSelector({ onAddProcess }: ProcessTypeSelectorProps) {
  const [processType, setProcessType] = useState<string>('Heat');
  const [paramType, setParamType] = useState<string>('Power');
  const [paramValue, setParamValue] = useState<number>(10);
  
  // Получение метки для параметра в зависимости от типа процесса и параметра
  const getParamLabel = (processType: string, paramType: string) => {
    switch (processType) {
      case 'Heat':
        return paramType === 'Power' ? 'Мощность, кВт' : 'Температура, °C';
      case 'Cool':
        return paramType === 'Power' ? 'Мощность, кВт' : 'Температура, °C';
      case 'Humidity':
        return paramType === 'Humidity' ? 'Влажность, %' : 'Расход воды, кг/ч';
      case 'Mix':
        return 'Соотношение смешения, %';
      case 'HeatRecovery':
        return 'Эффективность, %';
      case 'CustomPoint':
        return paramType === 'Temperature' ? 'Температура, °C' : 'Влажность, %';
      default:
        return 'Значение';
    }
  };
  
  // Получение опций для выбора типа параметра в зависимости от типа процесса
  const getParamOptions = (processType: string) => {
    switch (processType) {
      case 'Heat':
        return [
          { value: 'Power', label: 'Мощность' },
          { value: 'Temperature', label: 'Температура' }
        ];
      case 'Cool':
        return [
          { value: 'Power', label: 'Мощность' },
          { value: 'Temperature', label: 'Температура' }
        ];
      case 'Humidity':
        return [
          { value: 'Humidity', label: 'Влажность' },
          { value: 'Flow', label: 'Расход воды' }
        ];
      case 'Mix':
        return [{ value: 'Ratio', label: 'Соотношение' }];
      case 'HeatRecovery':
        return [{ value: 'Efficiency', label: 'Эффективность' }];
      case 'CustomPoint':
        return [
          { value: 'Temperature', label: 'Температура' },
          { value: 'Humidity', label: 'Влажность' }
        ];
      default:
        return [];
    }
  };

  // Получение цвета для процесса
  const getProcessColor = (type: string) => {
    switch (type) {
      case 'Heat': return 'bg-red-100 text-red-800 border-red-200';
      case 'Cool': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Humidity': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Mix': return 'bg-green-100 text-green-800 border-green-200';
      case 'HeatRecovery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CustomPoint': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Получение описания процесса
  const getProcessDescription = (type: string) => {
    switch (type) {
      case 'Heat': return 'Добавляет процесс нагрева для повышения температуры воздуха';
      case 'Cool': return 'Добавляет процесс охлаждения для снижения температуры и возможного осушения';
      case 'Humidity': return 'Добавляет процесс увлажнения для повышения влагосодержания воздуха';
      case 'Mix': return 'Добавляет процесс смешения двух воздушных потоков';
      case 'HeatRecovery': return 'Добавляет процесс рекуперации тепла между двумя потоками';
      case 'CustomPoint': return 'Добавляет пользовательский процесс к указанной точке';
      default: return '';
    }
  };
  
  // Обработчик добавления процесса
  const handleAddProcess = () => {
    onAddProcess(processType, paramType, paramValue);
    // Сброс значения после добавления
    setParamValue(processType === 'Heat' || processType === 'Cool' ? 10 : 
                  processType === 'Humidity' ? 70 :
                  processType === 'Mix' ? 50 : 80);
  };
  
  // Получаем опции для типа параметра
  const paramOptions = getParamOptions(processType);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 md:p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Добавить процесс</h3>
      
      {/* Выбор типа процесса */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Тип процесса:
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { value: 'Heat', label: 'Нагрев' },
            { value: 'Cool', label: 'Охлаждение' },
            { value: 'Humidity', label: 'Увлажнение' },
            { value: 'Mix', label: 'Смешение' },
            { value: 'HeatRecovery', label: 'Рекуперация' },
            { value: 'CustomPoint', label: 'Точка' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setProcessType(option.value);
                const options = getParamOptions(option.value);
                if (options.length > 0) {
                  setParamType(options[0].value);
                }
              }}
              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                processType === option.value 
                  ? getProcessColor(option.value) + ' border-opacity-100' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Параметры процесса */}
      <div className="space-y-4">
        {paramOptions.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип параметра:
            </label>
            <select
              value={paramType}
              onChange={(e) => setParamType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {paramOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {getParamLabel(processType, paramType)}:
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              value={paramValue}
              onChange={(e) => setParamValue(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={0}
              step={processType === 'Mix' || processType === 'Humidity' || processType === 'HeatRecovery' ? 1 : 0.1}
              placeholder={processType === 'Heat' || processType === 'Cool' ? '10' :
                          processType === 'Humidity' ? '70' :
                          processType === 'Mix' ? '50' : '80'}
            />
            <button
              onClick={handleAddProcess}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            >
              Добавить
            </button>
          </div>
        </div>
      </div>
      
      {/* Описание процесса */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Описание:</span> {getProcessDescription(processType)}
        </p>
      </div>
    </div>
  );
} 