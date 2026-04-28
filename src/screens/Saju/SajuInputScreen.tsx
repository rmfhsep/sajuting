import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { sajuApi } from '../../api/client';
import InputField from '../../components/InputField';
import GoldButton from '../../components/GoldButton';
import ScreenHeader from '../../components/ScreenHeader';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

const TIMES = [
  '모름', '子(자)시 23-01시', '丑(축)시 01-03시', '寅(인)시 03-05시',
  '卯(묘)시 05-07시', '辰(진)시 07-09시', '巳(사)시 09-11시', '午(오)시 11-13시',
  '未(미)시 13-15시', '申(신)시 15-17시', '酉(유)시 17-19시', '戌(술)시 19-21시', '亥(해)시 21-23시',
];

export default function SajuInputScreen() {
  const navigation = useNavigation<any>();
  const [birthDate, setBirthDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [gender, setGender] = useState<'남' | '여' | ''>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!birthDate) e.birthDate = '생년월일을 입력하세요';
    else if (!/^\d{8}$/.test(birthDate)) e.birthDate = 'YYYYMMDD 형식으로 입력하세요 (예: 19900101)';
    if (!gender) e.gender = '성별을 선택하세요';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAnalyze = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await sajuApi.analyze({
        birthDate,
        birthTime: selectedTime || '모름',
        gender,
      });
      navigation.navigate('SajuResult', { result: data.result, input: { birthDate, birthTime: selectedTime || '모름', gender } });
    } catch (err: any) {
      Alert.alert('오류', err.response?.data?.message || '분석에 실패했습니다. 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenHeader title="사주팔자" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.desc}>생년월일과 태어난 시를 입력하면{'\n'}AI가 사주팔자를 분석해드립니다</Text>

        <InputField
          label="생년월일"
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYYMMDD (예: 19900101)"
          keyboardType="number-pad"
          maxLength={8}
          error={errors.birthDate}
        />

        <Text style={styles.fieldLabel}>성별</Text>
        <View style={styles.genderRow}>
          {(['남', '여'] as const).map((g) => (
            <TouchableOpacity
              key={g}
              onPress={() => setGender(g)}
              style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
            >
              <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
                {g === '남' ? '남성 ♂' : '여성 ♀'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.gender ? <Text style={styles.error}>{errors.gender}</Text> : null}

        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>태어난 시</Text>
        <Text style={styles.timeNote}>모르면 '모름'을 선택하세요</Text>
        <View style={styles.timeGrid}>
          {TIMES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setSelectedTime(t)}
              style={[styles.timeBtn, selectedTime === t && styles.timeBtnActive]}
            >
              <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]} numberOfLines={2}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <GoldButton
          label="사주 분석하기"
          onPress={handleAnalyze}
          loading={loading}
          style={styles.btn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  desc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.lg },
  fieldLabel: { ...Typography.caption, color: Colors.textSecondary, marginBottom: Spacing.sm },
  genderRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xs },
  genderBtn: {
    flex: 1, height: 52, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  genderBtnActive: { borderColor: Colors.purple, backgroundColor: Colors.purple + '20' },
  genderText: { ...Typography.body, color: Colors.textSecondary },
  genderTextActive: { color: Colors.purple, fontWeight: '700' },
  error: { ...Typography.small, color: Colors.error, marginBottom: Spacing.sm },
  timeNote: { ...Typography.small, color: Colors.textMuted, marginBottom: Spacing.sm },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.lg },
  timeBtn: {
    paddingHorizontal: 10, paddingVertical: 8,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface, width: '30%',
  },
  timeBtnActive: { borderColor: Colors.purple, backgroundColor: Colors.purple + '20' },
  timeText: { ...Typography.small, textAlign: 'center', color: Colors.textSecondary, fontSize: 10 },
  timeTextActive: { color: Colors.purple },
  btn: { marginTop: Spacing.md },
});
