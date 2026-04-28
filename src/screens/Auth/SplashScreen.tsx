import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { Colors, Typography } from '../../constants/theme';

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const { loadStoredAuth, isAuthenticated } = useAuthStore();
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const init = async () => {
      await loadStoredAuth();
      setTimeout(() => {
        const state = useAuthStore.getState();
        navigation.replace(state.isAuthenticated ? 'Main' : 'Login');
      }, 1800);
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }], alignItems: 'center' }}>
        <Text style={styles.symbol}>☯</Text>
        <Text style={styles.title}>사주관상</Text>
        <Text style={styles.subtitle}>AI로 보는 나의 운명</Text>
      </Animated.View>
      <LinearGradient
        colors={['transparent', Colors.purple + '30', 'transparent']}
        style={styles.glow}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: { fontSize: 64, marginBottom: 16 },
  title: { ...Typography.h1, fontSize: 36, color: Colors.purple, letterSpacing: 6, marginBottom: 8 },
  subtitle: { ...Typography.caption, letterSpacing: 2 },
  glow: {
    position: 'absolute',
    bottom: '30%',
    width: '100%',
    height: 1,
  },
});
