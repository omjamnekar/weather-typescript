import axios from "axios";
import dotenv from "dotenv";
import chalk from "chalk";
import Table from "cli-table3";
import readlineSync from "readline-sync";

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const AIR_POLLUTION_URL =
  "https://api.openweathermap.org/data/2.5/air_pollution";
const ALERTS_URL = "https://api.openweathermap.org/data/2.5/onecall";
const HISTORICAL_URL =
  "https://api.openweathermap.org/data/2.5/onecall/timemachine";

// Fetch Weather Data
async function getWeather(city: string) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data: any = response.data as any;

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

async function getWeatherForecast(city: string) {
  try {
    const response = await axios.get(FORECAST_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const forecastData = (response.data as any).list;

    // Prepare the table to display forecast data
    const table = new Table({
      head: [
        chalk.cyanBright("Date & Time"),
        chalk.cyanBright("Temperature"),
        chalk.cyanBright("Condition"),
      ],
      colWidths: [30, 20, 30],
    });

    console.log(chalk.bold.magenta("\n5-Day Forecast:\n"));

    forecastData.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000).toLocaleString();
      const temp = `${forecast.main.temp}°C`;
      const condition = forecast.weather[0].description;

      // Add each forecast entry to the table
      table.push([
        chalk.green(date),
        chalk.green(temp),
        chalk.green(condition),
      ]);
    });

    console.log(table.toString()); // Display the table
  } catch (error: any) {
    console.error(
      "\nUnable to fetch forecast. Please check the city name and try again.\n"
    );
  }
}
async function getAirPollution(city: string) {
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

    // Prepare the table to display air pollution data
    const table = new Table({
      head: [
        chalk.cyanBright("Pollutant"),
        chalk.cyanBright("Concentration (µg/m³)"),
      ],
      colWidths: [30, 40],
    });

    console.log(chalk.bold.magenta("\nAir Pollution Data:\n"));

    table.push(
      [
        chalk.yellow("CO (Carbon Monoxide)"),
        chalk.green(`${pollutionData.co} µg/m³`),
      ],
      [
        chalk.yellow("NO2 (Nitrogen Dioxide)"),
        chalk.green(`${pollutionData.no2} µg/m³`),
      ],
      [chalk.yellow("O3 (Ozone)"), chalk.green(`${pollutionData.o3} µg/m³`)],
      [
        chalk.yellow("PM10 (Particulate Matter 10)"),
        chalk.green(`${pollutionData.pm10} µg/m³`),
      ]
    );

    console.log(table.toString()); // Display the table
  } catch (error: any) {
    console.error("\nUnable to fetch air pollution data. Please try again.\n");
  }
}
async function getWeatherAlerts(city: string) {
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

    const alertsData = (alertsResponse.data as any).alerts;

    if (alertsData && alertsData.length > 0) {
      // Prepare the table to display weather alerts
      const table = new Table({
        head: [
          chalk.cyanBright("Alert Type"),
          chalk.cyanBright("Description"),
          chalk.cyanBright("Start Time"),
          chalk.cyanBright("End Time"),
        ],
        colWidths: [20, 40, 30, 30],
      });

      console.log(chalk.bold.magenta("\nWeather Alerts:\n"));

      alertsData.forEach((alert: any) => {
        const alertType = alert.event;
        const description = alert.description;
        const startTime = new Date(alert.start * 1000).toLocaleString();
        const endTime = new Date(alert.end * 1000).toLocaleString();

        // Add each alert to the table
        table.push([
          chalk.yellow(alertType),
          chalk.green(description),
          chalk.green(startTime),
          chalk.green(endTime),
        ]);
      });

      console.log(table.toString()); // Display the table
    } else {
      console.log(chalk.green("\nNo weather alerts for this city.\n"));
    }
  } catch (error: any) {
    console.error("\nUnable to fetch weather alerts. Please try again.\n");
  }
}

// Fetch Historical Weather Data
async function getHistoricalWeather(city: string, date: number) {
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

    const historicalData = (historicalResponse.data as any).current;

    // Prepare the table to display historical weather data
    const table = new Table({
      head: [chalk.cyanBright("Attribute"), chalk.cyanBright("Value")],
      colWidths: [30, 50], // Adjust column widths for better visibility
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
    console.log(table.toString()); // Display the table in the console
  } catch (error: any) {
    console.error(
      "\nUnable to fetch historical weather data. Please try again.\n"
    );
  }
}

// Main User Input Interaction
async function getUserInput() {
  const city = readlineSync.question("Enter a city name: ");
  const options = [
    "Weather Report",
    "5 Day Forecast",
    "Air Pollution Data",
    "Weather Alerts",
    "Historical Weather (1 Day Ago)",
  ];

  const choice = readlineSync.keyInSelect(
    options,
    "What information would you like to fetch?"
  );
  switch (choice) {
    case 0:
      await getWeather(city);
      break;
    case 1:
      await getWeatherForecast(city);
      break;
    case 2:
      await getAirPollution(city);
      break;
    case 3:
      await getWeatherAlerts(city);
      break;
    case 4:
      await getHistoricalWeather(
        city,
        Math.floor(new Date().getTime() / 1000) - 86400
      );
      break;
    default:
      console.log("No valid selection made.");
  }
}

getUserInput();
