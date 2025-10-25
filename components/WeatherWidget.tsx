import React, { useState, useEffect } from 'react';

// Weather Icons Components
const SunIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.59a.75.75 0 11-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 01-1.06 0l-1.59-1.591a.75.75 0 111.06-1.06l1.59 1.59a.75.75 0 010 1.061zM12 18.75a.75.75 0 01-.75.75v2.25a.75.75 0 011.5 0V19.5a.75.75 0 01-.75-.75zM5.106 17.894a.75.75 0 010-1.06l1.59-1.591a.75.75 0 011.06 1.06l-1.59 1.59a.75.75 0 01-1.06 0zM2.25 12a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H3a.75.75 0 01-.75-.75zM6.106 5.106a.75.75 0 011.06 0l1.591 1.59a.75.75 0 01-1.06 1.06l-1.59-1.59a.75.75 0 010-1.06z" />
  </svg>
);
const CloudIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
     <path fillRule="evenodd" d="M11.275 2.043a.75.75 0 01.274.653 8.976 8.976 0 00-1.033 4.219.75.75 0 01-1.48.222A10.476 10.476 0 0110.1 1.51.75.75 0 0111.275 2.043zM3.42 5.06a.75.75 0 01.916.388 9 9 0 003.58 3.58.75.75 0 01-.915.388 10.501 10.501 0 01-4-4 .75.75 0 01.42-.856zM14.08 3.91a.75.75 0 01.856.42 10.501 10.501 0 014 4 .75.75 0 11-.916.388 9 9 0 00-3.58-3.58.75.75 0 01.388-.916zM18.94 10.86a.75.75 0 01.388.915 10.504 10.504 0 01-4 4 .75.75 0 01-.388-.915 9.004 9.004 0 003.58-3.58.75.75 0 01.42-.42zM5.06 15.58a.75.75 0 01.856-.42 9.004 9.004 0 003.58 3.58.75.75 0 01-.388.916 10.504 10.504 0 01-4-4 .75.75 0 01-.05-.496z" clipRule="evenodd" />
  </svg>
);
const RainIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M15.97 4.03a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06L16.5 5.62V12a.75.75 0 01-1.5 0V5.62L12.53 8.09a.75.75 0 01-1.06-1.06l3-3a.75.75 0 011.5 0zm-4.5 6a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06L12 11.62V18a.75.75 0 01-1.5 0v-6.38L8.03 14.09a.75.75 0 01-1.06-1.06l3-3a.75.75 0 011.5 0z" clipRule="evenodd" />
  </svg>
);


interface WeatherInfo {
  description: string;
  icon: React.FC<{ className?: string }>;
}

function getWeatherInfo(code: number): WeatherInfo {
  switch (code) {
    case 0: return { description: 'Trời quang', icon: SunIcon };
    case 1:
    case 2:
    case 3: return { description: 'Ít mây', icon: SunIcon };
    case 45:
    case 48: return { description: 'Sương mù', icon: CloudIcon };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82: return { description: 'Mưa', icon: RainIcon };
    default: return { description: 'Nhiều mây', icon: CloudIcon };
  }
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=21.0285&longitude=105.8542&current=temperature_2m,relative_humidity_2m,weathercode,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data.error) {
            throw new Error(data.reason || 'API returned an error');
        }

        if (data && data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.weathercode,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
          });
        } else {
            throw new Error('Invalid API response structure');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu thời tiết.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500">Đang tải...</div>;
    }
    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }
    if (weather) {
      const { description, icon: WeatherIconComponent } = getWeatherInfo(weather.weatherCode);
      return (
        <>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-800">{weather.temperature}°C</p>
              <p className="text-gray-500 font-medium">{description}</p>
            </div>
            <div className="text-amber-500">
              <WeatherIconComponent className="h-16 w-16" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200/80 flex justify-between text-sm text-gray-600">
             <span>Độ ẩm: <span className="font-semibold text-gray-800">{weather.humidity}%</span></span>
             <span>Gió: <span className="font-semibold text-gray-800">{weather.windSpeed} km/h</span></span>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-3">Thời tiết Hà Nội</h3>
      {renderContent()}
    </div>
  );
};

export default WeatherWidget;