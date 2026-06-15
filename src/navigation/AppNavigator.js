import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <DrawerNavigator /> : <AuthNavigator />;
}
