import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export default function WeatherCard({
  weather,
  onPress,
  onToggleFavorite,
  isFavorite = false,
}) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(weather)}>
      <View style={styles.info}>
        <Image
          source={{ uri: `${ICON_BASE_URL}/${weather.icon}@2x.png` }}
          style={styles.icon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.city}>
            {weather.city}
            {weather.country ? `, ${weather.country}` : ''}
          </Text>
          <Text style={styles.description}>{weather.description}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Text style={styles.temperature}>{weather.temperature}°C</Text>
        <Pressable
          onPress={() => onToggleFavorite(weather)}
          hitSlop={8}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? 'star' : 'star-outline'}
            size={22}
            color={isFavorite ? '#F9A825' : '#90A4AE'}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 50,
    height: 50,
  },
  textContainer: {
    marginLeft: 8,
    flex: 1,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: '#263238',
  },
  description: {
    fontSize: 13,
    color: '#607D8B',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  actions: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  temperature: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E88E5',
  },
  favoriteButton: {
    marginTop: 6,
  },
});
