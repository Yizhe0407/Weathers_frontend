import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WeatherData {
  startTime: string;
  value: string;
}

interface Props {
  weatherData: WeatherData[] | null;
}

const WeatherDetails: React.FC<Props> = ({ weatherData }) => {
  const [selectedDay, setSelectedDay] = useState<string>("今天");

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

  const filterWeatherData = () => {
    if (!weatherData) return weatherData;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0];
    const dayAfterTomorrow = new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split('T')[0];

    return weatherData.filter((data) => {
      const dataDate = data.startTime.split(" ")[0];
      if (selectedDay === "今天" && dataDate === today) return true;
      if (selectedDay === "明天" && dataDate === tomorrow) return true;
      if (selectedDay === "後天" && dataDate === dayAfterTomorrow) return true;
      return false;
    });
  };

  const filteredWeatherData = filterWeatherData();

  return (
    <div>
      {/* Radio buttons for day selection */}
      <RadioGroup defaultValue="今天" onValueChange={setSelectedDay}>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="今天" id="r1" />
            <Label htmlFor="r1">今天</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="明天" id="r2" />
            <Label htmlFor="r2">明天</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="後天" id="r3" />
            <Label htmlFor="r3">後天</Label>
          </div>
        </div>
      </RadioGroup>

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
                    <p className="w-full">{`${date}　 ${time}`}</p>
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
