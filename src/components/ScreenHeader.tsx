import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../constants/theme';

interface Props {
  title: string;
  showBack?: boolean;
}

export default function ScreenHeader({ title, showBack = true }: Props) {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: top + Spacing.sm }]}>
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.back} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.back} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  back: { width: 40 },
  backText: { fontSize: 22, color: Colors.textPrimary },
  title: { ...Typography.h3, flex: 1, textAlign: 'center' },
});
