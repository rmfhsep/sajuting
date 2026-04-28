export const Colors = {
  background: '#0A0A0A',
  surface: '#141414',
  surfaceHigh: '#1E1E1E',
  border: '#2A2A2A',
  purple: '#9B7AF0',
  purpleLight: '#B99BF5',
  purpleDark: '#7B5AC8',
  white: '#FFFFFF',
  textPrimary: '#F0F0F0',
  textSecondary: '#888888',
  textMuted: '#555555',
  error: '#FF4D4D',
  success: '#4CAF50',
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textPrimary },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.textPrimary },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textPrimary },
  caption: { fontSize: 13, fontWeight: '400' as const, color: Colors.textSecondary },
  small: { fontSize: 11, fontWeight: '400' as const, color: Colors.textMuted },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};
