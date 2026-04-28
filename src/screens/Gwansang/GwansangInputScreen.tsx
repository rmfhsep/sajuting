import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { gwansangApi } from '../../api/client';
import ScreenHeader from '../../components/ScreenHeader';
import GoldButton from '../../components/GoldButton';
import { Colors, Spacing, Radius, Typography } from '../../constants/theme';

export default function GwansangInputScreen() {
  const navigation = useNavigation<any>();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (fromCamera: boolean) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!perm.granted) {
      Alert.alert('권한 필요', fromCamera ? '카메라 권한이 필요합니다' : '갤러리 접근 권한이 필요합니다');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true, aspect: [3, 4] })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8, allowsEditing: true, aspect: [3, 4] });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!image) {
      Alert.alert('사진 필요', '관상을 볼 얼굴 사진을 선택해주세요');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      const filename = image.split('/').pop() || 'face.jpg';
      formData.append('image', { uri: image, name: filename, type: 'image/jpeg' } as any);

      const { data } = await gwansangApi.analyze(formData);
      navigation.navigate('GwansangResult', { result: data.result });
    } catch (err: any) {
      Alert.alert('오류', err.response?.data?.message || '분석에 실패했습니다. 다시 시도해주세요');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="관상 분석" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.desc}>
          정면을 바라보는 얼굴 사진을 업로드하면{'\n'}AI가 관상을 분석해드립니다
        </Text>

        <TouchableOpacity
          style={styles.imageArea}
          onPress={() => {
            Alert.alert('사진 선택', '사진을 어떻게 가져올까요?', [
              { text: '카메라로 촬영', onPress: () => pickImage(true) },
              { text: '갤러리에서 선택', onPress: () => pickImage(false) },
              { text: '취소', style: 'cancel' },
            ]);
          }}
          activeOpacity={0.8}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderIcon}>👤</Text>
              <Text style={styles.placeholderText}>사진을 선택하세요</Text>
              <Text style={styles.placeholderSub}>탭하여 카메라 또는 갤러리 선택</Text>
            </View>
          )}
        </TouchableOpacity>

        {image && (
          <TouchableOpacity style={styles.retake} onPress={() => setImage(null)}>
            <Text style={styles.retakeText}>다른 사진 선택</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tips}>
          <Text style={styles.tipsTitle}>📌 좋은 결과를 위한 팁</Text>
          {[
            '정면을 바라보는 사진이 좋습니다',
            '밝은 조명 아래서 촬영하세요',
            '선글라스나 마스크를 제거해주세요',
            '얼굴 전체가 나오도록 찍어주세요',
          ].map((tip, i) => (
            <Text key={i} style={styles.tipItem}>· {tip}</Text>
          ))}
        </View>

        <GoldButton
          label={loading ? '분석 중...' : '관상 분석하기'}
          onPress={handleAnalyze}
          loading={loading}
          disabled={!image}
          style={styles.btn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },
  desc: { ...Typography.body, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.lg },
  imageArea: {
    height: 280, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    borderStyle: 'dashed', overflow: 'hidden',
    backgroundColor: Colors.surface, marginBottom: Spacing.md,
  },
  previewImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderIcon: { fontSize: 56, marginBottom: Spacing.md },
  placeholderText: { ...Typography.body, color: Colors.textSecondary, marginBottom: 4 },
  placeholderSub: { ...Typography.small },
  retake: { alignItems: 'center', marginBottom: Spacing.lg },
  retakeText: { ...Typography.caption, color: Colors.purple },
  tips: {
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  tipsTitle: { ...Typography.caption, color: Colors.purple, marginBottom: Spacing.sm, fontWeight: '600' },
  tipItem: { ...Typography.small, color: Colors.textSecondary, marginBottom: 4, lineHeight: 18 },
  btn: {},
});
