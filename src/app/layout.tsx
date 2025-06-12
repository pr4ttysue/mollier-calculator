import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Калькулятор диаграммы Молье | Расчет и визуализация процессов обработки воздуха",
  description: "Интерактивный инструмент для инженерных расчетов с использованием диаграммы Молье. Рассчитывайте параметры воздуха, моделируйте процессы нагрева, охлаждения, увлажнения и смешения, визуализируйте результаты.",
  keywords: "диаграмма Молье, HVAC, влажный воздух, психрометрия, расчет, инженерный калькулятор, термодинамика",
  authors: [{ name: "MollierCalc Team" }],
  creator: "MollierCalc",
  robots: "index, follow"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
