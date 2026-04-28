import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Typography } from '../constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
  style?: ViewStyle;
}

export default function GoldButton({ label, onPress, loading, disabled, variant = 'filled', style }: Props) {
  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.outline, style]}
        activeOpacity={0.7}
      >
        <Text style={styles.outlineText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled || loading} activeOpacity={0.8} style={style}>
      <LinearGradient
        colors={[Colors.purpleLight, Colors.purple, Colors.purpleDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} size="small" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.body,
    fontWeight: '700',
    color: Colors.background,
    fontSize: 16,
  },
  outline: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineText: {
    ...Typography.body,
    color: Colors.purple,
    fontWeight: '600',
  },
});
