import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = "CWA-B16733A9-E5D3-432C-8C3B-32A5A302D6E5";

// Define the types for the response structure
interface ElementValue {
  value: string;
}

interface Time {
  startTime: string;
  elementValue: ElementValue[];
}

interface WeatherElement {
  time: Time[];
}

interface Location {
  weatherElement: WeatherElement[];
}

interface Locations {
  location: Location[];
}

interface Records {
  locations: Locations[];
}

interface WeatherResponse {
  records: Records;
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

    const { data } = await axios.get<WeatherResponse>(apiUrl, {
      params: {
        Authorization: API_KEY,
        locationName: town,
        elementName: "WeatherDescription",
      },
      headers: {
        accept: "application/json",
      },
    });

    const weatherElement = data.records.locations[0].location[0].weatherElement[0];

    // Extract startTime and value from elementValue
    const filteredData = weatherElement.time.map((item: Time) => ({
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
