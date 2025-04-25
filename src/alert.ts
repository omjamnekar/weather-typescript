import chalk from "chalk";
const ALERTS_URL = "https://api.openweathermap.org/data/2.5/onecall";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeatherAlerts(city: string, API_KEY: string) {
  try {
    const geoResponse = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
      },
    });

    const { lat, lon } = (geoResponse.data as any).coord;
    const alertsResponse = await axios.get(ALERTS_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });

    if (
      (alertsResponse.data as any).alerts &&
      (alertsResponse.data as any).alerts.length > 0
    ) {
      console.log(chalk.bold.magenta("\nWeather Alerts:\n"));
      (alertsResponse.data as any).alerts.forEach((alert: any) => {
        console.log(`Alert: ${alert.event}`);
        console.log(`Description: ${alert.description}`);
        console.log(
          `Start Time: ${new Date(alert.start * 1000).toLocaleString()}`
        );
        console.log(`End Time: ${new Date(alert.end * 1000).toLocaleString()}`);
        console.log("------------------------");
      });
    } else {
      console.log(chalk.green("\nNo alerts for this city.\n"));
    }
  } catch (error: any) {
    console.error("\nUnable to fetch weather alerts. Please try again.\n");
  }
}
