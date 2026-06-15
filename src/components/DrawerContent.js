import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { logout } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export default function DrawerContent(props) {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="partly-sunny" size={40} color="#1E88E5" />
        <Text style={styles.appName}>MobileClima</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <DrawerItem
        label="Início"
        icon={({ color, size }) => <Ionicons name="home" color={color} size={size} />}
        onPress={() => props.navigation.navigate('HomeStack')}
        activeTintColor="#1E88E5"
      />

      <DrawerItem
        label="Perfil"
        icon={({ color, size }) => <Ionicons name="person" color={color} size={size} />}
        onPress={() => props.navigation.navigate('Profile')}
        activeTintColor="#1E88E5"
      />

      <DrawerItem
        label="Sair"
        icon={({ color, size }) => <Ionicons name="log-out" color={color} size={size} />}
        onPress={handleLogout}
        activeTintColor="#E53935"
        inactiveTintColor="#E53935"
      />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEFF1',
    marginBottom: 8,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#263238',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 13,
    color: '#78909C',
    marginTop: 4,
  },
});
