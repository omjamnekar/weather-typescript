import chalk from "chalk";
import Table from "cli-table3";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const HISTORICAL_URL =
  "https://api.openweathermap.org/data/2.5/onecall/timemachine";

export async function getHistoricalWeather(
  city: string,
  date: number,
  API_KEY: string
) {
  try {
    const geoResponse = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
      },
    });

    const { lat, lon } = (geoResponse.data as any).coord;
    const historicalResponse = await axios.get(HISTORICAL_URL, {
      params: {
        lat,
        lon,
        dt: date, // Timestamp in seconds
        appid: API_KEY,
      },
    });

    // Prepare the table to display historical data
    const historicalData = (historicalResponse.data as any).current;

    const table = new Table({
      head: [chalk.cyanBright("Attribute"), chalk.cyanBright("Value")],
      colWidths: [30, 50],
    });

    table.push(
      [chalk.yellow("Temperature"), chalk.green(`${historicalData.temp}°C`)],
      [
        chalk.yellow("Condition"),
        chalk.green(`${historicalData.weather[0].description}`),
      ],
      [chalk.yellow("Humidity"), chalk.green(`${historicalData.humidity}%`)],
      [
        chalk.yellow("Wind Speed"),
        chalk.green(`${historicalData.wind_speed} m/s`),
      ],
      [chalk.yellow("Pressure"), chalk.green(`${historicalData.pressure} hPa`)]
    );

    console.log(chalk.bold.magenta("\nHistorical Weather Data:\n"));
    console.log(table.toString()); // Display the table
  } catch (error: any) {
    console.error(
      "\nUnable to fetch historical weather data. Please try again.\n"
    );
  }
}
