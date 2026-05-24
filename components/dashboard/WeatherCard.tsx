import { DashboardSection } from "@/components/dashboard/DashboardSection";
import type { WeatherData } from "@/lib/dashboardTypes";

type WeatherCardProps = {
  weather: WeatherData;
};

export function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <DashboardSection title="Weather" eyebrow={weather.city}>
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        <div>
          <p className="font-tight text-5xl font-semibold tracking-tight text-[#F8FAFC]">
            {Math.round(weather.temperature)}°
          </p>
          <p className="mt-2 text-sm text-[#9AA4B2]">{weather.condition}</p>
        </div>
        <div className="text-right text-xs text-[#9AA4B2]">
          <p>Humidity {weather.humidity}%</p>
          <p className="mt-1">Wind {weather.windKph} kph</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {weather.forecast.map((day) => (
          <div key={day.day} className="border border-white/[0.06] bg-[#050608]/50 p-2 text-center">
            <p className="font-tight text-[11px] font-bold uppercase text-[#9AA4B2]">{day.day}</p>
            <p className="mt-2 font-tight text-sm font-semibold text-[#F8FAFC]">{day.high}°</p>
            <p className="text-[11px] text-[#9AA4B2]">{day.condition}</p>
          </div>
        ))}
      </div>
    </DashboardSection>
  );
}
