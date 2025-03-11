import axios from 'axios';

const API_KEY = '2248e2e8b8086723c1b9141b6c1b8bcd';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  location: string;
  pressure: number;
  feelsLike: number;
  sunrise: number;
  sunset: number;
}

class WeatherService {
  private static instance: WeatherService;

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric', // Use metric units
        },
      });

      const data = response.data;
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        location: data.name,
        pressure: data.main.pressure,
        feelsLike: data.main.feels_like,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('Location not found. Please check the city name.');
      }
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }

  async getWeatherByCoordinates(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat: latitude,
          lon: longitude,
          appid: API_KEY,
          units: 'metric', // Use metric units
        },
      });

      const data = response.data;
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        location: data.name,
        pressure: data.main.pressure,
        feelsLike: data.main.feels_like,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
      };
    } catch (error) {
      throw new Error('Failed to fetch weather data. Please try again.');
    }
  }
}

export const weatherService = WeatherService.getInstance(); 