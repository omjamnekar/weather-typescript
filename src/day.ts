import chalk from "chalk";

const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

export async function getWeatherForecast(city: string, API_KEY: string) {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const forecastData = (response.data as any).list;
    console.log(chalk.bold.magenta("\n5-Day Forecast:\n"));
    forecastData.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000).toLocaleString();
      console.log(
        `${date}: ${forecast.main.temp}°C, ${forecast.weather[0].description}`
      );
    });
  } catch (error: any) {
    console.error(
      "\nUnable to fetch forecast. Please check the city name and try again.\n"
    );
  }
}
