import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Text style={styles.tagline}>Connection starts here.</Text>
        <Text style={styles.title}>BuiltOnIntimacy</Text>
        <Text style={styles.subtitle}>
          Meaningful relationships through intentional conversation.
        </Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>© 2026 BuiltOnIntimacy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 32,
    maxWidth: 480,
    width: '100%',
  },
  tagline: {
    fontSize: 14,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#e94560',
    marginBottom: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: Platform.select({ web: 52, default: 38 }),
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 17,
    color: '#a0a3b1',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#e94560',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    color: '#4a4a6a',
    fontSize: 12,
  },
});
