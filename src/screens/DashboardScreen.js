import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useFavorites } from '../hooks/useFavorites';
import { useWeather } from '../hooks/useWeather';
import { fetchWeatherByCity } from '../services/weatherApi';

const DEFAULT_CITIES = ['São Paulo', 'Rio de Janeiro', 'Brasília'];

export default function DashboardScreen({ navigation }) {
  const { searchCity, loading, error } = useWeather();
  const { favorites, loading: favoritesLoading, saving, isFavorite, toggleFavorite } = useFavorites();
  const [searchText, setSearchText] = useState('');
  const [weatherList, setWeatherList] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadWeatherForCities = useCallback(async (cities) => {
    const results = await Promise.all(
      cities.map(async (city) => {
        try {
          return await fetchWeatherByCity(city);
        } catch {
          return null;
        }
      }),
    );

    return results.filter(Boolean);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);

      const citiesToLoad = favorites.length > 0
        ? favorites.map((item) => item.city)
        : DEFAULT_CITIES;

      const data = await loadWeatherForCities(citiesToLoad);
      setWeatherList(data);
      setInitialLoading(false);
    };

    if (!favoritesLoading) {
      loadInitialData();
    }
  }, [favorites, favoritesLoading, loadWeatherForCities]);

  const handleSearch = async () => {
    const result = await searchCity(searchText);

    if (result) {
      setWeatherList((current) => {
        const exists = current.some((item) => item.id === result.id);
        if (exists) {
          return current.map((item) => (item.id === result.id ? result : item));
        }
        return [result, ...current];
      });
    }
  };

  const filteredList = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return weatherList;
    }

    return weatherList.filter((item) => item.city.toLowerCase().includes(query));
  }, [searchText, weatherList]);

  const handleOpenDetails = (weather) => {
    navigation.navigate('WeatherDetails', { weather });
  };

  const handleToggleFavorite = async (weather) => {
    try {
      await toggleFavorite(weather);
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  if (initialLoading || favoritesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão do tempo</Text>
      <Text style={styles.subtitle}>Busque cidades e salve seus favoritos</Text>

      <SearchBar
        value={searchText}
        onChangeText={setSearchText}
        onSubmit={handleSearch}
        placeholder="Buscar cidade (ex: Curitiba)"
      />

      <Pressable style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar clima</Text>
      </Pressable>

      {(loading || saving) && <LoadingSpinner size="small" inline />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WeatherCard
            weather={item}
            onPress={handleOpenDetails}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite(item.city)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma cidade encontrada. Faça uma busca.</Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#263238',
  },
  subtitle: {
    fontSize: 14,
    color: '#607D8B',
    marginBottom: 16,
    marginTop: 4,
  },
  searchButton: {
    backgroundColor: '#1E88E5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  error: {
    color: '#E53935',
    marginBottom: 8,
    fontSize: 14,
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#90A4AE',
    marginTop: 32,
    fontSize: 15,
  },
});
