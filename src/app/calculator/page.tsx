"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import MollierDiagram from '../../components/MollierDiagram';
import ChartSettings from '../../components/ChartSettings';

// Интерфейсы
interface Point {
  id: string;
  temperature: number;
  humidity: number;
  x: number;
  enthalpy: number;
  dewPoint: number;
  wetBulb: number;
  density: number;
}

export default function CalculatorPage() {
  const [points, setPoints] = useState<Point[]>([]);
  const [newPoint, setNewPoint] = useState({
    temperature: 20,
    humidity: 50
  });

  // Настройки диаграммы
  const [diagramSettings, setDiagramSettings] = useState({
    temperatureMin: -10,
    temperatureMax: 50,
    humidityMin: 0,
    humidityMax: 25,
    showComfortZone: true,
    airDensity: 1.2
  });

  // Обработчик изменения настроек диаграммы
  const handleSettingChange = (setting: string, value: number) => {
    setDiagramSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  // Функция расчета психрометрических параметров
  const calculateProperties = (temperature: number, relativeHumidity: number): Point => {
    const satPressure = 611.2 * Math.exp(17.67 * temperature / (temperature + 243.5));
    const vaporPressure = (relativeHumidity / 100) * satPressure;
    const x = 0.622 * vaporPressure / (101325 - vaporPressure);
    const enthalpy = 1.005 * temperature + x * (2501 + 1.84 * temperature);
    const dewPoint = 243.5 * Math.log(vaporPressure / 611.2) / (17.67 - Math.log(vaporPressure / 611.2));
    const wetBulb = temperature * Math.atan(0.151977 * Math.sqrt(relativeHumidity + 8.313659)) +
                   Math.atan(temperature + relativeHumidity) - Math.atan(relativeHumidity - 1.676331) +
                   0.00391838 * Math.pow(relativeHumidity, 1.5) * Math.atan(0.023101 * relativeHumidity) - 4.686035;
    const density = 1.225 * (1 - 0.378 * vaporPressure / 101325) * (273.15 / (temperature + 273.15));
    
    return {
      id: `P${points.length + 1}`,
      temperature,
      humidity: relativeHumidity,
      x: x * 1000, // г/кг
      enthalpy,
      dewPoint,
      wetBulb,
      density
    };
  };

  const addPoint = () => {
    const point = calculateProperties(newPoint.temperature, newPoint.humidity);
    setPoints([...points, point]);
  };

  const removePoint = (id: string) => {
    setPoints(points.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PsychroSim.ru</span>
            </Link>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setPoints([])}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                🔄 Очистить всё
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая панель - Ввод данных */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Добавить точку</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Температура (°C)
                  </label>
                  <input
                    type="number"
                    value={newPoint.temperature}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, temperature: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Относительная влажность (%)
                  </label>
                  <input
                    type="number"
                    value={newPoint.humidity}
                    onChange={(e) => setNewPoint(prev => ({ ...prev, humidity: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                    step="1"
                  />
                </div>
                
                <button
                  onClick={addPoint}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  ➕ Добавить точку
                </button>
              </div>

              {/* Быстрые точки */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Быстрые точки</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <button 
                    onClick={() => setNewPoint({ temperature: 20, humidity: 50 })}
                    className="p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                  >
                    Комфорт<br/>20°C, 50%
                  </button>
                  <button 
                    onClick={() => setNewPoint({ temperature: 0, humidity: 100 })}
                    className="p-2 bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100 transition-colors"
                  >
                    Насыщение<br/>0°C, 100%
                  </button>
                  <button 
                    onClick={() => setNewPoint({ temperature: 25, humidity: 30 })}
                    className="p-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors"
                  >
                    Сухо<br/>25°C, 30%
                  </button>
                  <button 
                    onClick={() => setNewPoint({ temperature: 30, humidity: 80 })}
                    className="p-2 bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                  >
                    Влажно<br/>30°C, 80%
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Центральная панель - Результаты */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Результаты расчета ({points.length} точек)
              </h2>
              
              {points.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Добавьте точки для начала расчета</p>
                  <p className="text-sm mt-2">Используйте панель слева для ввода параметров воздуха</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Точка</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Температура, °C</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Влажность, %</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Влагосодержание, г/кг</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Энтальпия, кДж/кг</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Точка росы, °C</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Мокрый термометр, °C</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Плотность, кг/м³</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {points.map((point) => (
                        <tr key={point.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {point.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.temperature.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.humidity.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.x.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.enthalpy.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.dewPoint.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.wetBulb.toFixed(1)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {point.density.toFixed(3)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() => removePoint(point.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ❌ Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {points.length > 0 && (
                <div className="mt-6 flex space-x-4">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    📊 Экспорт в Excel
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                    📄 Экспорт в PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Диаграмма Моллье */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Настройки диаграммы */}
        <ChartSettings 
          settings={diagramSettings} 
          onSettingChange={handleSettingChange}
        />
        
        {/* Диаграмма */}
        <div className="mt-6">
          <MollierDiagram 
            points={points} 
            settings={diagramSettings}
          />
        </div>
      </div>
    </div>
  );
} 