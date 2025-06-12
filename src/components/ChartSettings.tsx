"use client";

import React, { useState } from 'react';

interface ChartSettingsProps {
  settings: {
    humidityMin: number;
    humidityMax: number;
    temperatureMin: number;
    temperatureMax: number;
    showComfortZone: boolean;
    airDensity: number;
  };
  onSettingChange: (setting: string, value: number) => void;
}

export default function ChartSettings({ settings, onSettingChange }: ChartSettingsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Предустановленные диапазоны
  const presets = [
    { name: 'Зимний режим', tempMin: -20, tempMax: 30, humMin: 0, humMax: 15 },
    { name: 'Летний режим', tempMin: 10, tempMax: 50, humMin: 5, humMax: 25 },
    { name: 'Стандартный', tempMin: -10, tempMax: 40, humMin: 0, humMax: 20 },
    { name: 'Расширенный', tempMin: -30, tempMax: 60, humMin: 0, humMax: 30 }
  ];
  
  const applyPreset = (preset: { tempMin: number; tempMax: number; humMin: number; humMax: number }) => {
    onSettingChange('temperatureMin', preset.tempMin);
    onSettingChange('temperatureMax', preset.tempMax);
    onSettingChange('humidityMin', preset.humMin);
    onSettingChange('humidityMax', preset.humMax);
  };
  
  const handleRangeChange = (field: string, value: string, isMin: boolean) => {
    const numValue = parseFloat(value) || 0;
    if (field === 'temperature') {
      if (isMin) {
        onSettingChange('temperatureMin', numValue);
      } else {
        onSettingChange('temperatureMax', numValue);
      }
    } else if (field === 'humidity') {
      if (isMin) {
        onSettingChange('humidityMin', numValue);
      } else {
        onSettingChange('humidityMax', numValue);
      }
    }
  };

  const handleToggle = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    onSettingChange(field, event.target.checked ? 1 : 0);
  };
  
  return (
    <div className="bg-gray-50 p-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Настройки диаграммы</h4>
        
        {/* Предустановки */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Быстрые настройки:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Основные настройки */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Температурный диапазон */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900 mb-4">Диапазон температур</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Минимальная температура, °C
                </label>
                <input
                  type="number"
                  value={settings.temperatureMin}
                  onChange={(e) => handleRangeChange('temperature', e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Максимальная температура, °C
                </label>
                <input
                  type="number"
                  value={settings.temperatureMax}
                  onChange={(e) => handleRangeChange('temperature', e.target.value, false)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="1"
                />
              </div>
            </div>
          </div>
          
          {/* Диапазон влагосодержания */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h5 className="font-medium text-gray-900 mb-4">Диапазон влагосодержания</h5>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Минимальное влагосодержание, г/кг
                </label>
                <input
                  type="number"
                  value={settings.humidityMin}
                  onChange={(e) => handleRangeChange('humidity', e.target.value, true)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.5"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Максимальное влагосодержание, г/кг
                </label>
                <input
                  type="number"
                  value={settings.humidityMax}
                  onChange={(e) => handleRangeChange('humidity', e.target.value, false)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.5"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Дополнительные настройки */}
        <div className="border-t pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-4"
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            Дополнительные настройки
          </button>
          
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Плотность воздуха, кг/м³
                </label>
                <input
                  type="number"
                  value={settings.airDensity}
                  onChange={(e) => onSettingChange('airDensity', parseFloat(e.target.value) || 1.2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="0.01"
                  min="0.5"
                  max="2.0"
                />
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.showComfortZone}
                    onChange={handleToggle('showComfortZone')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Показать зону комфорта
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Отображает рекомендуемые параметры для жилых помещений
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h6 className="text-sm font-medium text-gray-700 mb-2">Сетка диаграммы</h6>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Основные линии сетки
                  </label>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Вспомогательные линии
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Информационная панель */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-900">Диапазон T:</span>
              <p className="text-blue-700">{settings.temperatureMin}°C - {settings.temperatureMax}°C</p>
            </div>
            <div>
              <span className="font-medium text-blue-900">Диапазон X:</span>
              <p className="text-blue-700">{settings.humidityMin} - {settings.humidityMax} г/кг</p>
            </div>
            <div>
              <span className="font-medium text-blue-900">Размер области:</span>
              <p className="text-blue-700">
                {(settings.temperatureMax - settings.temperatureMin) * (settings.humidityMax - settings.humidityMin)} единиц²
              </p>
            </div>
            <div>
              <span className="font-medium text-blue-900">Плотность воздуха:</span>
              <p className="text-blue-700">{settings.airDensity} кг/м³</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 