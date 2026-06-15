import { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { updateProfile } from 'firebase/auth';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { updateUserDisplayName } from '../services/firestoreService';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { favorites, profile, loading, saving } = useFavorites();
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setDisplayName(profile?.displayName || user?.displayName || '');
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!user) {
      return;
    }

    const trimmedName = displayName.trim();

    if (!trimmedName) {
      Alert.alert('Atenção', 'Informe um nome para o perfil.');
      return;
    }

    setSavingProfile(true);

    try {
      await updateProfile(user, { displayName: trimmedName });
      await updateUserDisplayName(user.uid, trimmedName);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Gerencie seus dados e favoritos</Text>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email}</Text>

        <Text style={[styles.label, styles.spacing]}>Nome</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Seu nome"
          placeholderTextColor="#90A4AE"
        />

        <Pressable
          style={styles.button}
          onPress={handleSaveProfile}
          disabled={savingProfile}
        >
          <Text style={styles.buttonText}>
            {savingProfile ? 'Salvando...' : 'Salvar perfil'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Cidades favoritas</Text>

      {(saving || savingProfile) && <LoadingSpinner size="small" inline />}

      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.city}-${item.country}`}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Text style={styles.favoriteCity}>
              {item.city}
              {item.country ? `, ${item.country}` : ''}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma cidade favorita ainda.</Text>
        }
        contentContainerStyle={styles.list}
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: '#78909C',
    marginBottom: 4,
  },
  spacing: {
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    color: '#263238',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CFD8DC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#263238',
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#1E88E5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 8,
  },
  favoriteItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  favoriteCity: {
    fontSize: 15,
    color: '#37474F',
    fontWeight: '500',
  },
  list: {
    paddingBottom: 24,
    flexGrow: 1,
  },
  empty: {
    color: '#90A4AE',
    fontSize: 14,
    marginTop: 8,
  },
});
