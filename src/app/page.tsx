// app/page.tsx
"use client";
import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { countyApiUrls, countiesWithTowns } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [county, setCounty] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCountyChange = (county: string) => {
    setCounty(county);
    setTown("");
  };

  const fetchWeather = async () => {
    if (!county || !town) {
      alert("請選擇縣市和鄉鎮。");
      return;
    }

    const apiUrl = countyApiUrls[county];

    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://weathers-backend.vercel.app/api/weather", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          town,
          apiUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`獲取天氣失敗: ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data.weatherData);
      console.log(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-screen">
      {isSignedIn && (
        <Button variant="outline" className="mb-4 bg-[#A79277] border-none text-white hover:bg-[#EAD8C0]" onClick={() => router.push("/dashboard")}>
          Dashboard
        </Button>
      )}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <div className="w-[325px] md:w-32 bg-[#FFF2E1] border-none rounded-lg">
          <Select onValueChange={handleCountyChange}>
            <SelectTrigger>
              <SelectValue placeholder="選擇縣市" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="基隆市">基隆市</SelectItem>
              <SelectItem value="臺北市">臺北市</SelectItem>
              <SelectItem value="新北市">新北市</SelectItem>
              <SelectItem value="桃園市">桃園市</SelectItem>
              <SelectItem value="新竹市">新竹市</SelectItem>
              <SelectItem value="新竹縣">新竹縣</SelectItem>
              <SelectItem value="苗栗縣">苗栗縣</SelectItem>
              <SelectItem value="臺中市">臺中市</SelectItem>
              <SelectItem value="彰化縣">彰化縣</SelectItem>
              <SelectItem value="南投縣">南投縣</SelectItem>
              <SelectItem value="雲林縣">雲林縣</SelectItem>
              <SelectItem value="嘉義市">嘉義市</SelectItem>
              <SelectItem value="嘉義縣">嘉義縣</SelectItem>
              <SelectItem value="臺南市">臺南市</SelectItem>
              <SelectItem value="高雄市">高雄市</SelectItem>
              <SelectItem value="屏東縣">屏東縣</SelectItem>
              <SelectItem value="宜蘭縣">宜蘭縣</SelectItem>
              <SelectItem value="花蓮縣">花蓮縣</SelectItem>
              <SelectItem value="臺東縣">臺東縣</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[325px] md:w-32 bg-[#FFF2E1] border-none rounded-lg">
          <Select onValueChange={setTown} disabled={!county}>
            <SelectTrigger>
              <SelectValue placeholder={county ? "選擇鄉鎮" : "請先選擇縣市"} />
            </SelectTrigger>
            {county && (
              <SelectContent>
                {countiesWithTowns[county]?.map((town) => (
                  <SelectItem key={town} value={town}>
                    {town}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={fetchWeather}
          className="bg-[#A79277] hover:bg-[#EAD8C0] text-white border-none px-3 py-2 rounded w-[325px] md:w-32"
          disabled={loading}
        >
          {loading ? "Loading..." : "確定"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <WeatherDetails weatherData={weatherData} />
    </div>
  );
}
