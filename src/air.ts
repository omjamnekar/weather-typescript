import chalk from "chalk";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const AIR_POLLUTION_URL =
  "https://api.openweathermap.org/data/2.5/air_pollution";

export async function getAirPollution(city: string, API_KEY: string) {
  try {
    const geoResponse = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
      },
    });

    const { lat, lon } = (geoResponse.data as any).coord;
    const pollutionResponse = await axios.get(AIR_POLLUTION_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });

    const pollutionData = (pollutionResponse.data as any).list[0].components;
    console.log(chalk.bold.magenta("\nAir Pollution Data:\n"));
    console.log(`CO: ${pollutionData.co} µg/m³`);
    console.log(`NO2: ${pollutionData.no2} µg/m³`);
    console.log(`O3: ${pollutionData.o3} µg/m³`);
    console.log(`PM10: ${pollutionData.pm10} µg/m³`);
  } catch (error: any) {
    console.error("\nUnable to fetch air pollution data. Please try again.\n");
  }
}
