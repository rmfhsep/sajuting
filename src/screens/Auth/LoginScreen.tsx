import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import InputField from '../../components/InputField';
import GoldButton from '../../components/GoldButton';
import { Colors, Spacing, Typography, Radius } from '../../constants/theme';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { setUser, demoLogin } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = '이메일을 입력하세요';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = '올바른 이메일 형식이 아닙니다';
    if (!password) e.password = '비밀번호를 입력하세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authApi.login(email, password);
      await setUser(data.user, data.accessToken, data.refreshToken);
      navigation.replace('Main');
    } catch (err: any) {
      Alert.alert('로그인 실패', err.response?.data?.message || '이메일 또는 비밀번호를 확인하세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.symbol}>☯</Text>
          <Text style={styles.title}>사주관상</Text>
          <Text style={styles.subtitle}>AI로 보는 나의 운명</Text>
        </View>

        <View style={styles.form}>
          <InputField
            label="이메일"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@email.com"
            error={errors.email}
          />
          <InputField
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="비밀번호 입력"
            error={errors.password}
          />
          <GoldButton label="로그인" onPress={handleLogin} loading={loading} style={styles.btn} />
          <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.register}>
            <Text style={styles.registerText}>
              계정이 없으신가요? <Text style={styles.registerLink}>회원가입</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.demoWrap}>
            <View style={styles.demoDivider} />
            <Text style={styles.demoOr}>또는</Text>
            <View style={styles.demoDivider} />
          </View>
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={async () => { await demoLogin(); navigation.replace('Main'); }}
            activeOpacity={0.8}
          >
            <Text style={styles.demoBtnText}>🔮  데모로 체험하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  header: { alignItems: 'center', paddingTop: 100, paddingBottom: 48 },
  symbol: { fontSize: 48, marginBottom: 12 },
  title: { ...Typography.h1, fontSize: 32, color: Colors.purple, letterSpacing: 4, marginBottom: 6 },
  subtitle: { ...Typography.caption, letterSpacing: 1 },
  form: { flex: 1 },
  btn: { marginTop: Spacing.sm },
  register: { alignItems: 'center', marginTop: Spacing.lg },
  registerText: { ...Typography.caption, color: Colors.textSecondary },
  registerLink: { color: Colors.purple, fontWeight: '600' },
  demoWrap: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xl, marginBottom: Spacing.md },
  demoDivider: { flex: 1, height: 1, backgroundColor: Colors.border },
  demoOr: { ...Typography.small, color: Colors.textMuted, marginHorizontal: Spacing.md },
  demoBtn: {
    height: 52, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  demoBtnText: { ...Typography.body, color: Colors.textSecondary, fontWeight: '500' },
});
