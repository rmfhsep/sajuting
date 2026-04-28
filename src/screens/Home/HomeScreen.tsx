import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

const { width } = Dimensions.get('window');

function MenuCard({
  title, subtitle, emoji, colors, onPress,
}: {
  title: string;
  subtitle: string;
  emoji: string;
  colors: [string, string];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={styles.card}>
      <LinearGradient colors={[Colors.surface, Colors.surfaceHigh]} style={styles.cardInner}>
        <View style={styles.cardAccent}>
          <LinearGradient colors={colors} style={styles.accentLine} />
        </View>
        <Text style={styles.cardEmoji}>{emoji}</Text>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
        <View style={styles.cardArrow}>
          <Text style={{ color: colors[0], fontSize: 18 }}>→</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuthStore();
  const { top } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.headerArea, { paddingTop: top + Spacing.md }]}>
          <Text style={styles.greeting}>안녕하세요, {user?.name}님</Text>
          <Text style={styles.tagline}>오늘의 운명을 알아보세요</Text>
          <View style={styles.divider} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>무엇을 알아볼까요?</Text>
        </View>

        <View style={styles.cardRow}>
          <MenuCard
            title="사주팔자"
            subtitle="생년월일시로 보는 운명"
            emoji="🔮"
            colors={[Colors.purple, Colors.purpleDark]}
            onPress={() => navigation.navigate('SajuInput')}
          />
          <MenuCard
            title="관상"
            subtitle="얼굴로 보는 나의 기운"
            emoji="👁"
            colors={[Colors.purpleLight, Colors.purpleDark]}
            onPress={() => navigation.navigate('GwansangInput')}
          />
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>최근 기록</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyPage')}>
            <Text style={styles.viewAll}>전체보기 →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.historyBanner}
          onPress={() => navigation.navigate('MyPage')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Colors.surface, Colors.surfaceHigh]}
            style={styles.historyInner}
          >
            <Text style={styles.historyEmoji}>📜</Text>
            <View>
              <Text style={styles.historyTitle}>나의 운명 기록</Text>
              <Text style={styles.historyDesc}>지금까지의 사주 & 관상 결과 보기</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const cardWidth = (width - Spacing.lg * 2 - Spacing.md) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerArea: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg },
  greeting: { ...Typography.h2, fontSize: 24 },
  tagline: { ...Typography.caption, marginTop: 4, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: Colors.border, marginTop: Spacing.lg },
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  sectionTitle: { ...Typography.h3, color: Colors.textSecondary, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  cardRow: { flexDirection: 'row', paddingHorizontal: Spacing.lg, gap: Spacing.md },
  card: { width: cardWidth },
  cardInner: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 160,
    overflow: 'hidden',
  },
  cardAccent: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderTopLeftRadius: Radius.lg, borderTopRightRadius: Radius.lg, overflow: 'hidden' },
  accentLine: { flex: 1 },
  cardEmoji: { fontSize: 36, marginBottom: Spacing.sm, marginTop: Spacing.xs },
  cardTitle: { ...Typography.h3, fontSize: 16, marginBottom: 4 },
  cardSubtitle: { ...Typography.small, lineHeight: 16 },
  cardArrow: { position: 'absolute', bottom: Spacing.md, right: Spacing.md },
  recentSection: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.sm,
  },
  viewAll: { ...Typography.caption, color: Colors.purple },
  historyBanner: { marginHorizontal: Spacing.lg, marginBottom: Spacing.xxl },
  historyInner: {
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
  },
  historyEmoji: { fontSize: 32 },
  historyTitle: { ...Typography.body, fontWeight: '600' },
  historyDesc: { ...Typography.caption, marginTop: 2 },
});
