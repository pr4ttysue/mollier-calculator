"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// Основной компонент приложения
export default function HomePage() {
  const router = useRouter();
  const [chartStyle, setChartStyle] = useState<'mollier' | 'psychro'>('mollier');
  const [language, setLanguage] = useState('ru');
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  const handleStartCalculator = () => {
    // Сохраняем настройки в localStorage
    localStorage.setItem('chartStyle', chartStyle);
    localStorage.setItem('language', language);
    localStorage.setItem('units', units);
    
    router.push('/calculator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PsychroSim.ru</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Возможности</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">О проекте</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Войти
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Калькулятор диаграммы Моллье
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Профессиональный инструмент для расчета и анализа параметров воздуха с интерактивной диаграммой Моллье
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
              <span>Множественные процессы</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">📄</span>
              </div>
              <span>Экспорт в PDF</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">💾</span>
              </div>
              <span>Сохранение проектов</span>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center">Выберите настройки</h2>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Chart Style */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Стиль диаграммы</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setChartStyle('mollier')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      chartStyle === 'mollier'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">M</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Диаграмма Моллье</h4>
                      <p className="text-sm text-gray-600">Классическая i-x диаграмма</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setChartStyle('psychro')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      chartStyle === 'psychro'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">P</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Психрометрическая</h4>
                      <p className="text-sm text-gray-600">Температура vs влагосодержание</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Язык диаграммы</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
                    { code: 'en', name: 'English', flag: '🇺🇸' },
                    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
                    { code: 'es', name: 'Español', flag: '🇪🇸' },
                    { code: 'fr', name: 'Français', flag: '🇫🇷' },
                    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        language === lang.code
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium text-gray-900">{lang.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Units */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Система единиц</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setUnits('metric')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      units === 'metric'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 mb-2">МЕТРИЧЕСКАЯ</h4>
                      <p className="text-sm text-gray-600">°C • кВт • кг</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setUnits('imperial')}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                      units === 'imperial'
                        ? 'border-blue-500 bg-blue-50 shadow-lg'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-center">
                      <h4 className="font-bold text-gray-900 mb-2">ИМПЕРСКАЯ</h4>
                      <p className="text-sm text-gray-600">°F • BTU/h • lb</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleStartCalculator}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 rounded-xl text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                >
                  🚀 Перейти к диаграмме
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Возможности приложения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Интерактивная диаграмма</h3>
              <p className="text-gray-600">
                Полнофункциональная диаграмма Моллье с возможностью построения до 5 процессов подряд
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">🔧</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Точные расчеты</h3>
              <p className="text-gray-600">
                Расчеты основаны на справочнике ASHRAE с учетом реальной плотности воздуха
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-purple-600 text-xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Экспорт отчетов</h3>
              <p className="text-gray-600">
                Создание PDF отчетов с диаграммой, расчетами и параметрами всех процессов
              </p>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="mt-20 bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Интерактивная психрометрическая диаграмма онлайн
          </h2>
          <div className="prose prose-lg max-w-4xl mx-auto text-gray-600">
            <p>
              С помощью психрометрической диаграммы (также известной как диаграмма Моллье) вы можете 
              строить процессы влажного воздуха и рассчитывать параметры воздуха. Эта диаграмма широко 
              используется в машиностроении и технологии ОВиК и отображает <em>температуру</em> относительно 
              <em>влагосодержания</em>. Диаграмма сочетается с линиями <em>относительной влажности</em> и 
              <em>энтальпии</em> для расчета изменения общей внутренней энергии.
            </p>
            <p>
              Психрометрическая диаграмма также известна как &quot;диаграмма Моллье&quot;. На конференции по 
              термодинамике в Лос-Анджелесе (1923) было решено назвать диаграмму в честь Ричарда Моллье.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Интерактивная психрометрическая диаграмма</h3>
            <p className="text-gray-400 mb-4">
              Расчеты основаны на справочнике ASHRAE - Основы (издание SI) - Психрометрия
            </p>
            <p className="text-sm text-gray-500">
              Этот веб-сайт предоставляет информацию, а не профессиональные консультации. 
              Никакой ответственности за рассчитанные значения.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Copyright © 2025 | Все права защищены
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

