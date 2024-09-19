interface WeatherData {
  startTime: string;
  value: string;
}

interface Props {
  weatherData: WeatherData[] | null;
}

const WeatherDetails: React.FC<Props> = ({ weatherData }) => {
  const formatWeatherData = (data: WeatherData) => {
    const [date, timeWithSeconds] = data.startTime.split(" "); // Split date and time with seconds
    const time = timeWithSeconds.slice(0, 5); // Remove the seconds from time (12:00:00 -> 12:00)
    const [weather, rainChance, temp, comfort, wind] = data.value.split("。"); // Splitting values based on punctuation
    const rainPercent = rainChance?.match(/\d+/)?.[0]; // Extracting percentage

    // Extract only the numeric part of the temperature (e.g., "29" from "溫度攝氏29度")
    const temperature = temp?.match(/\d+/)?.[0] || "N/A";

    // Extract only the wind direction, ignoring the speed
    const windDirection = wind?.match(/^[\u4e00-\u9fa5]+風/)?.[0] || "N/A";

    return {
      date: date.split("-").slice(1).join("/"), // Converting to mm/dd format
      time,
      weather,
      rainPercent,
      temperature, // Returning the numeric temperature
      comfort: comfort || "N/A", // Handle missing comfort data
      windDirection, // Getting only the wind direction
    };
  };

  if (!weatherData || weatherData.length === 0) {
    return <p className="text-center mt-4">目前無天氣資料。</p>; // Display message when no data
  }

  return (
    <div className="flex flex-wrap justify-center mt-4 p-4 gap-4">
      {weatherData.map((data) => {
        const { date, time, weather, rainPercent, temperature, comfort, windDirection } =
          formatWeatherData(data);

        return (
          <div className="p-4 w-[325px] border rounded-lg" key={data.startTime}>
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
      })}
    </div>
  );
};

export default WeatherDetails;
