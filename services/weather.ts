import { OPENWEATHER_API_KEY } from "@env";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeather(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
  );
  if (!res.ok) throw new Error("Failed to fetch weather");
  return res.json();
}

export async function fetchForecast(lat: number, lon: number) {
  const res = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`,
  );
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return res.json();
}
