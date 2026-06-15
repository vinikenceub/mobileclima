import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={22} color="#1E88E5" />
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function WeatherDetailsScreen({ route }) {
  const { weather } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Image
          source={{ uri: `${ICON_BASE_URL}/${weather.icon}@4x.png` }}
          style={styles.icon}
        />
        <Text style={styles.city}>
          {weather.city}
          {weather.country ? `, ${weather.country}` : ''}
        </Text>
        <Text style={styles.temperature}>{weather.temperature}°C</Text>
        <Text style={styles.description}>{weather.description}</Text>
      </View>

      <View style={styles.card}>
        <DetailRow
          icon="thermometer-outline"
          label="Sensação térmica"
          value={`${weather.feelsLike}°C`}
        />
        <DetailRow
          icon="water-outline"
          label="Umidade"
          value={`${weather.humidity}%`}
        />
        <DetailRow
          icon="speedometer-outline"
          label="Pressão"
          value={`${weather.pressure} hPa`}
        />
        <DetailRow
          icon="flag-outline"
          label="Vento"
          value={`${weather.windSpeed} m/s`}
        />
        {weather.visibility ? (
          <DetailRow
            icon="eye-outline"
            label="Visibilidade"
            value={`${(weather.visibility / 1000).toFixed(1)} km`}
          />
        ) : null}
        {weather.coord ? (
          <DetailRow
            icon="navigate-outline"
            label="Coordenadas"
            value={`${weather.coord.lat.toFixed(2)}, ${weather.coord.lon.toFixed(2)}`}
          />
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FC',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    width: 120,
    height: 120,
  },
  city: {
    fontSize: 26,
    fontWeight: '700',
    color: '#263238',
    marginTop: 8,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1E88E5',
    marginTop: 4,
  },
  description: {
    fontSize: 16,
    color: '#607D8B',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
  },
  detailLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#546E7A',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#263238',
  },
});
