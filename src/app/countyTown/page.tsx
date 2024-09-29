"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { countyApiUrls } from "@/lib/countyApiUrls";
import WeatherDetails from "@/components/WeatherDetails";

export default function CountyTownPage() {
    const searchParams = useSearchParams();
    const county = searchParams.get("county");
    const town = searchParams.get("town");

    const [weatherData, setWeatherData] = useState(null); // Store weather data
    const [error, setError] = useState<string | null>(null); // Store any errors
    const [loading, setLoading] = useState<boolean>(false); // Manage loading state

    useEffect(() => {
        // Fetch weather data only when both county and town are available
        if (county && town) {
            const apiUrl = countyApiUrls[county]; // Get API URL based on county

            const fetchWeatherData = async () => {
                setLoading(true); // Start loading before fetching the data
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
                    setWeatherData(data.weatherData); // Update weather data
                    setError(null); // Clear any previous errors
                } catch (error) {
                    if (error instanceof Error) {
                        setError(error.message); // Display error message if any
                    } else {
                        setError(String(error)); // Convert error to string if necessary
                    }
                } finally {
                    setLoading(false); // Stop loading once the fetch is complete
                }
            };

            fetchWeatherData(); // Call the fetch function
        }
    }, [county, town]); // Re-fetch when county or town changes

    // Case when county or town is missing
    if (!county || !town) {
        return <div>Error: County or Town not provided</div>;
    }

    // Display error if exists
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Show loading spinner while fetching data
    if (loading) {
        return (
            <div className="flex justify-center">
                <Image
                    src="/images/loading-level.gif"
                    alt="Loading..."
                    width={150}
                    height={150}
                />
            </div>
        );
    }

    // Render weather data after successful fetch
    if (weatherData) {
        return (
            <div>
                <WeatherDetails weatherData={weatherData} />
            </div>
        );
    }

    // Default case: return null to prevent rendering until data is available
    return null;
}
