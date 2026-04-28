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
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { setUser } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name) e.name = '이름을 입력하세요';
    if (!email) e.email = '이메일을 입력하세요';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = '올바른 이메일 형식이 아닙니다';
    if (!password) e.password = '비밀번호를 입력하세요';
    else if (password.length < 8) e.password = '8자 이상 입력하세요';
    if (password !== confirm) e.confirm = '비밀번호가 일치하지 않습니다';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await authApi.register(email, password, name);
      await setUser(data.user, data.accessToken, data.refreshToken);
      navigation.replace('Main');
    } catch (err: any) {
      Alert.alert('회원가입 실패', err.response?.data?.message || '다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="회원가입" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <InputField label="이름" value={name} onChangeText={setName} placeholder="홍길동" error={errors.name} />
        <InputField
          label="이메일" value={email} onChangeText={setEmail}
          keyboardType="email-address" autoCapitalize="none"
          placeholder="example@email.com" error={errors.email}
        />
        <InputField
          label="비밀번호" value={password} onChangeText={setPassword}
          secureTextEntry placeholder="8자 이상" error={errors.password}
        />
        <InputField
          label="비밀번호 확인" value={confirm} onChangeText={setConfirm}
          secureTextEntry placeholder="비밀번호 재입력" error={errors.confirm}
        />
        <GoldButton label="가입하기" onPress={handleRegister} loading={loading} style={styles.btn} />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.login}>
          <Text style={styles.loginText}>
            이미 계정이 있으신가요? <Text style={styles.loginLink}>로그인</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  btn: { marginTop: Spacing.sm },
  login: { alignItems: 'center', marginTop: Spacing.lg },
  loginText: { ...Typography.caption, color: Colors.textSecondary },
  loginLink: { color: Colors.purple, fontWeight: '600' },
});
