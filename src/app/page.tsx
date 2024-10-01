// app/page.tsx
"use client";
import Image from "next/image";
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
import { countyApiUrls, countyWithTowns } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function Page() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [county, setCounty] = useState<string>("");
  const [town, setTown] = useState<string>("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const countyNames: string[] = Object.keys(countyApiUrls);

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

    setTown(town.split('_')[0]);

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
              {countyNames.map((county) => (
                <SelectItem key={county} value={county}>
                  {county}
                </SelectItem>
              ))}
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
                {countyWithTowns[county]?.map((town) => (
                  <SelectItem key={town} value={town}>
                    {town.split('_')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={fetchWeather}
          className="bg-[#A79277] hover:bg-[#A79277] text-white border-none px-3 py-2 rounded w-[325px] md:w-32"
          disabled={loading}
        >
          {loading ? (
            <Image
              src="/images/loading-level.gif"
              alt="Loading..."
              width={120}
              height={120}
            />
          ) :
            "確定"}
        </Button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <WeatherDetails weatherData={weatherData} />
    </div>
  );
}
