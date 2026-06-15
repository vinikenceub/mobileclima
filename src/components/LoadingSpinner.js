import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function LoadingSpinner({ size = 'large', color = '#1E88E5', inline = false }) {
  return (
    <View style={inline ? styles.inlineContainer : styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  inlineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
});
