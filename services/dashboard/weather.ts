import { prisma } from "@/lib/prisma";
import type { WeatherData } from "@/lib/dashboardTypes";

const mockWeather: WeatherData = {
  city: "New Delhi",
  temperature: 32,
  condition: "Hazy sun",
  humidity: 42,
  windKph: 11,
  forecast: [
    { day: "Mon", high: 33, low: 25, condition: "Sun" },
    { day: "Tue", high: 34, low: 26, condition: "Haze" },
    { day: "Wed", high: 31, low: 24, condition: "Cloud" },
    { day: "Thu", high: 30, low: 24, condition: "Rain" },
    { day: "Fri", high: 32, low: 25, condition: "Sun" },
  ],
};

export async function getWeatherData(city = "New Delhi"): Promise<WeatherData> {
  const data = { ...mockWeather, city };

  try {
    await prisma.weatherSnapshot.create({
      data: {
        city: data.city,
        temperature: data.temperature,
        condition: data.condition,
        humidity: data.humidity,
        windKph: data.windKph,
        forecast: data.forecast,
      },
    });
  } catch {
    // Snapshot writes are opportunistic until external providers are connected.
  }

  return data;
}
