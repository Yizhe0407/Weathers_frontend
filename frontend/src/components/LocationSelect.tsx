// components/LocationSelect.tsx
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countyApiUrls, countiesWithTowns } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function LocationSelect() {
  const [county, setCounty] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCountyChange = (county: string) => {
    setCounty(county);
    setTown(""); // Reset town when county changes
  };

  const fetchWeather = async () => {
    if (!county || !town) {
      alert("Please select both a county and a town.");
      return;
    }

    const apiUrl = countyApiUrls[county];
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          town: town,
          apiUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error fetching weather: ${response.statusText}`);
      }

      const { weatherData } = await response.json();
      setWeatherData(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="w-[325px] md:w-32">
          <Select onValueChange={handleCountyChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇縣市" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>北部</SelectLabel>
                <SelectItem value="基隆市">基隆市</SelectItem>
                <SelectItem value="臺北市">臺北市</SelectItem>
                <SelectItem value="新北市">新北市</SelectItem>
                <SelectItem value="桃園市">桃園市</SelectItem>
                <SelectItem value="新竹市">新竹市</SelectItem>
                <SelectItem value="新竹縣">新竹縣</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>中部</SelectLabel>
                <SelectItem value="苗栗縣">苗栗縣</SelectItem>
                <SelectItem value="臺中市">臺中市</SelectItem>
                <SelectItem value="彰化縣">彰化縣</SelectItem>
                <SelectItem value="南投縣">南投縣</SelectItem>
                <SelectItem value="雲林縣">雲林縣</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>南部</SelectLabel>
                <SelectItem value="嘉義市">嘉義市</SelectItem>
                <SelectItem value="嘉義縣">嘉義縣</SelectItem>
                <SelectItem value="臺南市">臺南市</SelectItem>
                <SelectItem value="高雄市">高雄市</SelectItem>
                <SelectItem value="屏東縣">屏東縣</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>東部</SelectLabel>
                <SelectItem value="宜蘭縣">宜蘭縣</SelectItem>
                <SelectItem value="花蓮縣">花蓮縣</SelectItem>
                <SelectItem value="臺東縣">臺東縣</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[325px] md:w-32">
          <Select onValueChange={setTown} disabled={!county}>
            <SelectTrigger>
              <SelectValue placeholder={county ? "選擇鄉鎮" : "請先選擇縣市"} />
            </SelectTrigger>
            {county && (
              <SelectContent>
                <SelectGroup>
                  {countiesWithTowns[county]?.map((town) => (
                    <SelectItem key={town} value={town}>
                      {town}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            )}
          </Select>
        </div>


        <button
          onClick={fetchWeather}
          className="bg-blue-500 text-white px-3 py-2 rounded w-[325px] md:w-32"
          disabled={loading}
        >
          {loading ? "Loading..." : "確定"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <WeatherDetails weatherData={weatherData} />
    </div>
  );
}
