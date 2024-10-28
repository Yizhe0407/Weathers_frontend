import { Sun, MoonStar, CloudSun, CloudMoon, CloudRain, Cloud, CloudRainWind } from 'lucide-react';
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

  const getDayOfWeek = (dateString: string) => {
    const daysOfWeek = ["日", "一", "二", "三", "四", "五", "六"];
    const date = new Date(dateString);
    return daysOfWeek[date.getDay()];
  };

  const formatWeatherData = (data: WeatherData) => {
    if (!data.startTime || !data.value) {
      return {
        date: "N/A",
        time: "N/A",
        weather: "N/A",
        rainPercent: "N/A",
        temperature: "N/A",
        comfort: "N/A",
        windDirection: "N/A",
      };
    }

    const [date, timeWithSeconds] = data.startTime.split(" ");
    const time = timeWithSeconds.slice(0, 5);
    const [weather, rainChance, temp, comfort, wind] = data.value.split("。");
    const rainPercent = rainChance?.match(/\d+/)?.[0];
    const temperature = temp?.match(/\d+/)?.[0] || "N/A";
    const windDirection = wind?.match(/^[\u4e00-\u9fa5]+風/)?.[0] || "N/A";

    const dayOfWeek = getDayOfWeek(date);

    return {
      date: `${date.split("-").slice(1).join("/")} (${dayOfWeek})`,
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

  const isDayTime = (time: string) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 6 && hour <= 15;
  };

  const getWeatherIcon = (weather: string, time: string) => {
    const dayTime = isDayTime(time);

    if (weather.includes("晴")) return dayTime ? <Sun /> : <MoonStar />;
    if (weather.includes("多雲")) return dayTime ? <CloudSun /> : <CloudMoon />;
    if (weather.includes("陰")) return <Cloud />;
    if (weather.includes("午後短暫雷陣雨")) return <CloudRainWind />;
    if (weather.includes("短暫陣雨") || weather.includes("短暫雨") || weather.includes("陣雨")) return <CloudRain />;
  };

  const filteredWeatherData = filterWeatherData();

  return (
    <div>
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
          <p className="text-center mt-4">目前無天氣資料</p>
        ) : (
          filteredWeatherData.map((data) => {
            const { date, time, weather, rainPercent, temperature, comfort, windDirection } =
              formatWeatherData(data);

            return (
              <div className="p-4 w-[325px] border bg-[#FFF2E1] border-none rounded-lg" key={data.startTime}>
                <div className="flex flex-col flex-wrap gap-4">
                  <div className="flex justify-between items-center">
                    <div className="w-full h-full flex gap-6 items-center">
                      <div className="flex flex-col">
                        <p className="w-full">{`${date}`}</p>
                        <p className="w-full">{`${time}`}</p>
                      </div>
                      {getWeatherIcon(weather, time)}
                    </div>
                    <p className="w-full bg-[#d1bb9e] px-4 py-1 rounded-lg text-white text-bold">{weather}</p>
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