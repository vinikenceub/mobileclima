import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/DashboardScreen';
import WeatherDetailsScreen from '../screens/WeatherDetailsScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Início' }}
      />
      <Stack.Screen
        name="WeatherDetails"
        component={WeatherDetailsScreen}
        options={{ title: 'Detalhes do clima' }}
      />
    </Stack.Navigator>
  );
}
