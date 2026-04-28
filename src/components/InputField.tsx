import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export default function InputField({ label, error, ...props }: Props) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, focused && styles.inputFocused, error && styles.inputError]}
        placeholderTextColor={Colors.textMuted}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { ...Typography.caption, marginBottom: Spacing.xs, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    height: 52,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  inputFocused: { borderColor: Colors.purple },
  inputError: { borderColor: Colors.error },
  error: { ...Typography.small, color: Colors.error, marginTop: Spacing.xs },
});
