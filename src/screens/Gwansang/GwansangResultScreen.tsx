import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../../components/ScreenHeader';
import GoldButton from '../../components/GoldButton';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';
import { GwansangResult } from '../../types';

type RouteParams = { GwansangResult: { result: GwansangResult } };

const FEATURES = [
  { key: 'eyes', icon: '👁', label: '눈' },
  { key: 'nose', icon: '👃', label: '코' },
  { key: 'lips', icon: '💋', label: '입' },
  { key: 'forehead', icon: '🌟', label: '이마' },
] as const;

function FeatureCard({ icon, label, content }: { icon: string; label: string; content: string }) {
  return (
    <View style={styles.featureCard}>
      <View style={styles.featureLeft}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={styles.featureLabel}>{label}</Text>
      </View>
      <Text style={styles.featureContent}>{content}</Text>
    </View>
  );
}

export default function GwansangResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, 'GwansangResult'>>();
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <ScreenHeader title="관상 분석 결과" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#9B7AF030', '#9B7AF008']} style={styles.overallBox}>
          <Text style={styles.overallIcon}>🔮</Text>
          <Text style={styles.overallLabel}>종합 관상</Text>
          <Text style={styles.overallContent}>{result.overall}</Text>
        </LinearGradient>

        <Text style={styles.sectionTitle}>이목구비 분석</Text>
        <View style={styles.featuresBox}>
          {FEATURES.map((f) => (
            <FeatureCard key={f.key} icon={f.icon} label={f.label} content={result[f.key]} />
          ))}
        </View>

        <View style={styles.fortuneBox}>
          <LinearGradient colors={[Colors.surface, Colors.surfaceHigh]} style={styles.fortuneInner}>
            <View style={styles.cardHeader}>
              <Text style={styles.fortuneIcon}>⭐</Text>
              <Text style={styles.fortuneLabel}>관상으로 보는 운세</Text>
            </View>
            <Text style={styles.fortuneContent}>{result.fortune}</Text>
          </LinearGradient>
        </View>

        <GoldButton
          label="다시 분석하기"
          onPress={() => navigation.navigate('Main', { screen: 'GwansangInput' })}
          variant="outline"
          style={styles.btn}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })} style={styles.homeBtn}>
          <Text style={styles.homeBtnText}>홈으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  overallBox: {
    borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: '#9B7AF040',
    alignItems: 'center', marginBottom: Spacing.lg,
  },
  overallIcon: { fontSize: 40, marginBottom: Spacing.sm },
  overallLabel: { ...Typography.caption, color: '#9B7AF0', marginBottom: Spacing.sm, fontWeight: '600' },
  overallContent: { ...Typography.body, lineHeight: 24, color: Colors.textSecondary, textAlign: 'center' },
  sectionTitle: { ...Typography.caption, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: Spacing.md },
  featuresBox: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', marginBottom: Spacing.md,
  },
  featureCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  featureLeft: { width: 60, alignItems: 'center', marginRight: Spacing.md },
  featureIcon: { fontSize: 24, marginBottom: 4 },
  featureLabel: { ...Typography.small, color: Colors.textMuted },
  featureContent: { ...Typography.body, flex: 1, lineHeight: 22, color: Colors.textSecondary },
  fortuneBox: { marginBottom: Spacing.lg },
  fortuneInner: {
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  fortuneIcon: { fontSize: 20, marginRight: Spacing.sm },
  fortuneLabel: { ...Typography.h3, fontSize: 15, color: Colors.purple },
  fortuneContent: { ...Typography.body, lineHeight: 24, color: Colors.textSecondary },
  btn: { marginBottom: Spacing.md },
  homeBtn: { alignItems: 'center', paddingVertical: Spacing.sm },
  homeBtnText: { ...Typography.caption, color: Colors.textMuted },
});
