import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../../components/ScreenHeader';
import GoldButton from '../../components/GoldButton';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';
import { SajuResult } from '../../types';

type RouteParams = {
  SajuResult: {
    result: SajuResult;
    input: { birthDate: string; birthTime: string; gender: string };
  };
};

function ResultCard({ icon, label, content }: { icon: string; label: string; content: string }) {
  return (
    <View style={styles.card}>
      <LinearGradient colors={[Colors.surface, Colors.surfaceHigh]} style={styles.cardInner}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <Text style={styles.cardLabel}>{label}</Text>
        </View>
        <Text style={styles.cardContent}>{content}</Text>
      </LinearGradient>
    </View>
  );
}

export default function SajuResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'SajuResult'>>();
  const { result, input } = route.params;

  return (
    <View style={styles.container}>
      <ScreenHeader title="사주 분석 결과" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <LinearGradient colors={[Colors.purple + '30', Colors.purple + '08']} style={styles.infoInner}>
            <Text style={styles.infoText}>
              {input.birthDate.slice(0, 4)}년 {input.birthDate.slice(4, 6)}월 {input.birthDate.slice(6)}일 · {input.gender}성 · {input.birthTime}
            </Text>
          </LinearGradient>
        </View>

        <ResultCard icon="☯" label="사주팔자" content={result.saju} />
        <ResultCard icon="🌊" label="오행 분석" content={result.elements} />
        <ResultCard icon="🧠" label="성격 & 기질" content={result.personality} />
        <ResultCard icon="⭐" label="운세" content={result.fortune} />
        <ResultCard icon="💡" label="조언" content={result.advice} />

        <GoldButton
          label="다시 분석하기"
          onPress={() => navigation.navigate('SajuInput')}
          variant="outline"
          style={styles.btn}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeBtn}>
          <Text style={styles.homeBtnText}>홈으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  infoBox: { marginBottom: Spacing.lg, borderRadius: Radius.md, overflow: 'hidden' },
  infoInner: { padding: Spacing.md, alignItems: 'center' },
  infoText: { ...Typography.caption, color: Colors.purple, letterSpacing: 0.5 },
  card: { marginBottom: Spacing.md },
  cardInner: {
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  cardIcon: { fontSize: 20, marginRight: Spacing.sm },
  cardLabel: { ...Typography.h3, fontSize: 15, color: Colors.purple },
  cardContent: { ...Typography.body, lineHeight: 24, color: Colors.textSecondary },
  btn: { marginBottom: Spacing.md },
  homeBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  homeBtnText: { ...Typography.caption, color: Colors.textMuted },
});
