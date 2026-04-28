import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sajuApi, gwansangApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';
import { SajuReading, GwansangReading } from '../../types';

type Tab = 'saju' | 'gwansang';

function SajuItem({ item }: { item: SajuReading }) {
  const d = item.birthDate;
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.historyIcon}>🔮</Text>
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>
          {d.slice(0, 4)}.{d.slice(4, 6)}.{d.slice(6)} · {item.gender}성
        </Text>
        <Text style={styles.historyPreview} numberOfLines={2}>{item.result.fortune}</Text>
        <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
      </View>
    </View>
  );
}

function GwansangItem({ item }: { item: GwansangReading }) {
  return (
    <View style={styles.historyItem}>
      <View style={styles.historyLeft}>
        <Text style={styles.historyIcon}>👁</Text>
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>관상 분석</Text>
        <Text style={styles.historyPreview} numberOfLines={2}>{item.result.overall}</Text>
        <Text style={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</Text>
      </View>
    </View>
  );
}

export default function MyPageScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('saju');
  const [sajuList, setSajuList] = useState<SajuReading[]>([]);
  const [gwansangList, setGwansangList] = useState<GwansangReading[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const [s, g] = await Promise.all([sajuApi.getHistory(), gwansangApi.getHistory()]);
      setSajuList(s.data.readings);
      setGwansangList(g.data.readings);
    } catch {}
  };

  useFocusEffect(useCallback(() => { loadHistory(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: async () => { await logout(); navigation.replace('Login'); } },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top + Spacing.md }]}>
        <View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {([['saju', '사주 기록'], ['gwansang', '관상 기록']] as [Tab, string][]).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key)}
          >
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.purple} />}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'saju' ? (
          sajuList.length > 0
            ? sajuList.map((item) => <SajuItem key={item.id} item={item} />)
            : <EmptyState emoji="🔮" text="아직 사주 기록이 없어요" />
        ) : (
          gwansangList.length > 0
            ? gwansangList.map((item) => <GwansangItem key={item.id} item={item} />)
            : <EmptyState emoji="👁" text="아직 관상 기록이 없어요" />
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyEmoji}>{emoji}</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.lg,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  userName: { ...Typography.h3 },
  userEmail: { ...Typography.caption, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.border,
  },
  logoutText: { ...Typography.caption, color: Colors.textMuted },
  tabs: {
    flexDirection: 'row', paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md, gap: Spacing.sm,
  },
  tab: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    alignItems: 'center', backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  tabActive: { backgroundColor: Colors.purple + '20', borderColor: Colors.purple },
  tabText: { ...Typography.caption, color: Colors.textMuted },
  tabTextActive: { color: Colors.purple, fontWeight: '600' },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  historyItem: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.md, marginBottom: Spacing.sm,
  },
  historyLeft: { marginRight: Spacing.md },
  historyIcon: { fontSize: 28 },
  historyInfo: { flex: 1 },
  historyTitle: { ...Typography.body, fontWeight: '600', marginBottom: 4 },
  historyPreview: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18, marginBottom: 6 },
  historyDate: { ...Typography.small },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { ...Typography.body, color: Colors.textMuted },
});
