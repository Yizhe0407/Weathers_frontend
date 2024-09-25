"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { countyApiUrls } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function CountyTownPage() {
    const searchParams = useSearchParams();
    const county = searchParams.get("county");
    const town = searchParams.get("town");
    const [weatherData, setWeatherData] = useState(null); // 使用 useState 存储 weatherData
    const [error, setError] = useState<string | null>(null); // 将 error 状态指定为 string 或 null

    useEffect(() => {
        // 只有当 county 和 town 存在时才发起请求
        if (county && town) {
            const apiUrl = countyApiUrls[county];

            const fetchWeatherData = async () => {
                try {
                    const response = await fetch("/api/weather", {
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
                    // 显式处理 'unknown' 类型的 error
                    if (error instanceof Error) {
                        setError(error.message); // 如果 error 是 Error 实例，获取错误消息
                    } else {
                        setError(String(error)); // 如果 error 是其他类型，强制转换为字符串
                    }
                }
            };

            fetchWeatherData(); // 调用异步请求函数
        }
    }, [county, town]); // useEffect 依赖 county 和 town

    if (!county || !town) {
        return <div>Error: County or Town not provided</div>;
    }

    if (error) {
        return <div>Error: {error}</div>; // 显示错误信息
    }

    if (!weatherData) {
        return <div>Loading...</div>; // 显示加载状态
    }

    return (
        <div>
            <WeatherDetails weatherData={weatherData} /> {/* 渲染天气详情组件 */}
        </div>
    );
}
