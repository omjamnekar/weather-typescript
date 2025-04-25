import chalk from "chalk";
import Table from "cli-table3";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Fetch Weather Data
export async function getWeather(city: string, API_KEY: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data: any = response.data;

    const table = new Table({
      head: [chalk.cyanBright("Attribute"), chalk.cyanBright("Value")],
      colWidths: [20, 40],
    });

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const localTime = new Date((data.dt + data.timezone) * 1000).toUTCString();

    table.push(
      [
        chalk.yellow("Location"),
        chalk.green(`${data.name}, ${data.sys.country}`),
      ],
      [chalk.yellow("Local Time"), chalk.green(localTime)],
      [chalk.yellow("Temperature"), chalk.green(`${data.main.temp}°C`)],
      [chalk.yellow("Feels Like"), chalk.green(`${data.main.feels_like}°C`)],
      [
        chalk.yellow("Condition"),
        chalk.green(`${data.weather[0].description}`),
      ],
      [chalk.yellow("Humidity"), chalk.green(`${data.main.humidity}%`)],
      [chalk.yellow("Wind Speed"), chalk.green(`${data.wind.speed} m/s`)],
      [chalk.yellow("Sunrise"), chalk.green(sunrise)],
      [chalk.yellow("Sunset"), chalk.green(sunset)]
    );

    console.log(chalk.bold.magenta("\nWeather Report:\n"));
    console.log(table.toString());
  } catch (error: any) {
    console.error(
      "\nUnable to fetch weather. Please check the city name and try again.\n"
    );
  }
}
