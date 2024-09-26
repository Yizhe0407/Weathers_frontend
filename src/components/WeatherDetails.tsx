import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface WeatherData {
  startTime: string;
  value: string;
}

interface Props {
  weatherData: WeatherData[] | null;
}

const WeatherDetails: React.FC<Props> = ({ weatherData }) => {
  // Default to "今天" being selected
  const [selectedDays, setSelectedDays] = useState<string[]>(["今天"]);

  const formatWeatherData = (data: WeatherData) => {
    const [date, timeWithSeconds] = data.startTime.split(" ");
    const time = timeWithSeconds.slice(0, 5);
    const [weather, rainChance, temp, comfort, wind] = data.value.split("。");
    const rainPercent = rainChance?.match(/\d+/)?.[0];
    const temperature = temp?.match(/\d+/)?.[0] || "N/A";
    const windDirection = wind?.match(/^[\u4e00-\u9fa5]+風/)?.[0] || "N/A";

    return {
      date: date.split("-").slice(1).join("/"),
      time,
      weather,
      rainPercent,
      temperature,
      comfort: comfort || "N/A",
      windDirection,
    };
  };

  const handleCheckboxChange = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const filterWeatherData = () => {
    if (!weatherData || selectedDays.length === 0) return weatherData;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0];
    const dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split('T')[0];

    return weatherData.filter((data) => {
      const dataDate = data.startTime.split(" ")[0];
      if (selectedDays.includes("今天") && dataDate === today) return true;
      if (selectedDays.includes("明天") && dataDate === tomorrow) return true;
      if (selectedDays.includes("後天") && dataDate === dayAfterTomorrow) return true;
      return false;
    });
  };

  const filteredWeatherData = filterWeatherData();

  return (
    <div>
      {/* Checkboxes for day selection */}
      <div className="flex justify-center gap-4 mt-4">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("今天")}
            onCheckedChange={() => handleCheckboxChange("今天")}
          />
          <span>今天</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("明天")}
            onCheckedChange={() => handleCheckboxChange("明天")}
          />
          <span>明天</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={selectedDays.includes("後天")}
            onCheckedChange={() => handleCheckboxChange("後天")}
          />
          <span>後天</span>
        </label>
      </div>

      {/* Display weather data based on selection */}
      <div className="flex flex-wrap justify-center mt-4 p-4 gap-4">
        {(!filteredWeatherData || filteredWeatherData.length === 0) ? (
          <p className="text-center mt-4">目前無天氣資料。</p>
        ) : (
          filteredWeatherData.map((data) => {
            const { date, time, weather, rainPercent, temperature, comfort, windDirection } =
              formatWeatherData(data);

            return (
              <div className="p-4 w-[325px] border bg-[#FFF2E1] border-none rounded-lg" key={data.startTime}>
                <div className="flex flex-col flex-wrap gap-4">
                  <div className="flex justify-between">
                    <p className="w-full">{`${date} ${time}`}</p>
                    <p className="w-full">{weather}</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex w-full">
                      <p className="mr-8">溫度</p>
                      <p>{`${temperature}°C`}</p>
                    </div>
                    <div className="flex w-full">
                      <p className="mr-8">降雨機率</p>
                      <p>{`${rainPercent}%`}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex w-full">
                      <p className="mr-8">風向</p>
                      <p>{windDirection}</p>
                    </div>
                    <div className="flex w-full">
                      <p className="mr-12">舒適度</p>
                      <p>{`${comfort}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
