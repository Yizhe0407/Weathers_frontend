"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { countyApiUrls } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function CountyTownPage() {
    const searchParams = useSearchParams();
    const county = searchParams.get("county");
    const town = searchParams.get("town");
    const [weatherData, setWeatherData] = useState(null); // 使用 useState 儲存 weatherData
    const [error, setError] = useState<string | null>(null); // 將 error 狀態指定為 string 或 null

    useEffect(() => {
        // 只有當 county 和 town 存在時才發起請求
        if (county && town) {
            const apiUrl = countyApiUrls[county];

            const fetchWeatherData = async () => {
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
                        throw new Error("Failed to fetch weather data");
                    }

                    const data = await response.json();
                    setWeatherData(data.weatherData); // 更新 weatherData
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message); // 如果 error 是 Error 實例，取得錯誤訊息
                    } else {
                        setError(String(error)); // 如果 error 是其他類型，強制轉換為字串
                    }
                }
            };

            fetchWeatherData(); // 呼叫非同步請求函數
        }
    }, [county, town]); // useEffect 依賴 county 和 town

    if (!county || !town) {
        return <div>Error: County or Town not provided</div>;
    }

    if (error) {
        return <div>Error: {error}</div>; // 顯示錯誤訊息
    }

    if (!weatherData) {
        return <div className="p-4 text-center text-2xl animate-pulse">Loading...</div>
    }

    return (
        <div>
            <WeatherDetails weatherData={weatherData} />
        </div>
    );
}
