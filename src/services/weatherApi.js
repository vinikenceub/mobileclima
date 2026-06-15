const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

function formatWeatherData(raw) {
  return {
    id: `${raw.id}-${raw.name}`,
    city: raw.name,
    country: raw.sys?.country || '',
    temperature: Math.round(raw.main.temp),
    feelsLike: Math.round(raw.main.feels_like),
    humidity: raw.main.humidity,
    windSpeed: raw.wind?.speed ?? 0,
    description: raw.weather[0]?.description || '',
    icon: raw.weather[0]?.icon || '01d',
    pressure: raw.main.pressure,
    visibility: raw.visibility,
    coord: raw.coord,
  };
}

export async function fetchWeatherByCity(city) {
  if (!API_KEY) {
    throw new Error('Configure EXPO_PUBLIC_OPENWEATHER_API_KEY no arquivo .env');
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=pt_br`;
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Cidade não encontrada. Verifique o nome e tente novamente.');
    }
    throw new Error('Não foi possível buscar o clima. Tente novamente.');
  }

  const data = await response.json();
  return formatWeatherData(data);
}

export async function fetchWeatherByCoords(lat, lon) {
  if (!API_KEY) {
    throw new Error('Configure EXPO_PUBLIC_OPENWEATHER_API_KEY no arquivo .env');
  }

  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Não foi possível buscar o clima para sua localização.');
  }

  const data = await response.json();
  return formatWeatherData(data);
}
