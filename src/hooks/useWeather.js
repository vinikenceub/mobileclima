import { useCallback, useState } from 'react';
import { fetchWeatherByCity } from '../services/weatherApi';

export function useWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchCity = useCallback(async (city) => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError('Digite o nome de uma cidade.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWeatherByCity(trimmedCity);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!data?.city) {
      return null;
    }

    return searchCity(data.city);
  }, [data?.city, searchCity]);

  return {
    data,
    loading,
    error,
    searchCity,
    refresh,
  };
}
