// src/app/api/route.ts
import { NextResponse } from "next/server";

const API_KEY = "CWA-B16733A9-E5D3-432C-8C3B-32A5A302D6E5";

interface WeatherElementValue {
  value: string;
}

interface WeatherElementTime {
  startTime: string;
  elementValue: WeatherElementValue[];
}

interface WeatherElement {
  time: WeatherElementTime[];
}

interface Location {
  weatherElement: WeatherElement[];
}

interface Locations {
  location: Location[];
}

interface WeatherApiResponse {
  records: {
    locations: Locations[];
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { town, apiUrl } = body;

    if (!town || !apiUrl) {
      return new Response("Missing town or apiUrl in request", {
        status: 400,
      });
    }

    const response = await fetch(
      `${apiUrl}?Authorization=${API_KEY}&locationName=${town}&elementName=WeatherDescription`,
      {
        headers: {
          accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data: WeatherApiResponse = await response.json();

    const weatherElement = data.records.locations[0].location[0].weatherElement[0];

    const filteredData = weatherElement.time.map((item: WeatherElementTime) => ({
      startTime: item.startTime,
      value: item.elementValue[0].value,
    }));

    return NextResponse.json({ weatherData: filteredData }, { status: 200 });
  } catch (err) {
    console.error("Error fetching weather data:", err);
    return new Response("Error occurred", {
      status: 500,
    });
  }
}