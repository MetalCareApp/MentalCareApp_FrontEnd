import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import AppColor from '../../utils/AppColor';

type RootStackParamList = {
  diary_detail: { diaryId: number };
};

type DiaryDetailRouteProp = RouteProp<RootStackParamList, 'diary_detail'>;

type EmotionType = '좋음' | '보통' | '우울' | '불안' | '화남' | '지침';

type DiaryDetail = {
  id: number;
  date: string;
  emotion: EmotionType;
  sleepStart: string;
  sleepEnd: string;
  sleepHours: string;
  tookMedicine: boolean;
  medicineReaction: string;
  diary: string;
  createdAt: string;
  updatedAt: string;
};

const DUMMY_DIARY_DATA: DiaryDetail[] = [
  {
    id: 1,
    date: '2026-03-12',
    emotion: '보통',
    sleepStart: '23:40',
    sleepEnd: '07:10',
    sleepHours: '7시간 30분',
    tookMedicine: true,
    medicineReaction: '복용 후 약간 졸렸지만 크게 불편하진 않았다.',
    diary:
      '오늘은 전반적으로 무난한 하루였다. 오전에는 할 일을 하나씩 처리했고, 오후에는 조금 피곤했지만 계획했던 일들을 어느 정도 끝냈다. 저녁에는 쉬는 시간을 가지면서 컨디션을 정리했다.',
    createdAt: '2026-03-12T09:30:00',
    updatedAt: '2026-03-12T10:00:00',
  },
  {
    id: 2,
    date: '2026-03-11',
    emotion: '좋음',
    sleepStart: '00:10',
    sleepEnd: '08:00',
    sleepHours: '7시간 50분',
    tookMedicine: false,
    medicineReaction: '',
    diary:
      '기분이 꽤 좋았던 하루였다. 아침부터 집중이 잘 됐고, 사람들과의 대화도 편안했다. 전체적으로 에너지가 괜찮아서 만족스러웠다.',
    createdAt: '2026-03-11T20:10:00',
    updatedAt: '2026-03-11T20:10:00',
  },
  {
    id: 3,
    date: '2026-03-10',
    emotion: '불안',
    sleepStart: '02:00',
    sleepEnd: '06:30',
    sleepHours: '4시간 30분',
    tookMedicine: true,
    medicineReaction: '속이 조금 울렁거렸고 졸림이 있었다.',
    diary:
      '잠을 충분히 못 자서 그런지 하루 종일 마음이 불안정했다. 해야 할 일은 있었지만 집중이 잘 안 됐고, 사소한 일에도 예민하게 반응했다. 저녁에는 최대한 자극을 줄이고 쉬려고 했다.',
    createdAt: '2026-03-10T22:40:00',
    updatedAt: '2026-03-10T23:00:00',
  },
];

const emotionLabelMap: Record<EmotionType, string> = {
  좋음: '좋음',
  보통: '보통',
  우울: '우울',
  불안: '불안',
  화남: '화남',
  지침: '지침',
};

const emotionColorMap: Record<EmotionType, string> = {
  좋음: '#16A34A',
  보통: '#6B7280',
  우울: '#2563EB',
  불안: '#F59E0B',
  화남: '#DC2626',
  지침: '#7C3AED',
};

const DiaryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DiaryDetailRouteProp>();
  const { diaryId } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [diaryDetail, setDiaryDetail] = useState<DiaryDetail | null>(null);
  const [error, setError] = useState<string>('');

  const formattedCreatedAt = useMemo(() => {
    if (!diaryDetail?.createdAt) return '';
    return dayjs(diaryDetail.createdAt).format('YYYY.MM.DD HH:mm');
  }, [diaryDetail]);

  const formattedUpdatedAt = useMemo(() => {
    if (!diaryDetail?.updatedAt) return '';
    return dayjs(diaryDetail.updatedAt).format('YYYY.MM.DD HH:mm');
  }, [diaryDetail]);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 추후 서버 연동 시 이 부분에서 diaryId를 사용해 API 요청
        // 예시:
        // const response = await api.get(`/diaries/${diaryId}`);
        // setDiaryDetail(response.data);

        const foundDiary = DUMMY_DIARY_DATA.find(item => item.id === diaryId);

        if (!foundDiary) {
          setError('일기 데이터를 찾을 수 없습니다.');
          setDiaryDetail(null);
          return;
        }

        setDiaryDetail(foundDiary);
      } catch (e) {
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
        setDiaryDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryDetail();
  }, [diaryId]);

  const handleRetry = () => {
    setLoading(true);
    setError('');

    const foundDiary = DUMMY_DIARY_DATA.find(item => item.id === diaryId);

    if (!foundDiary) {
      setError('일기 데이터를 찾을 수 없습니다.');
      setDiaryDetail(null);
      setLoading(false);
      return;
    }

    setDiaryDetail(foundDiary);
    setLoading(false);
  };

  const handleDeletePress = () => {
    Alert.alert('삭제', '서버 연동 후 삭제 기능을 추가할 예정입니다.');
  };

  const handleEditPress = () => {
    //@ts-ignore
    navigation.navigate('diary_edit', { diaryId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColor.main} />
        <Text style={styles.loadingText}>일기 데이터를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !diaryDetail) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.errorDescription}>
          {error || '일기 데이터를 찾을 수 없습니다.'}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>일기 상세</Text>
          <Text style={styles.headerDate}>{diaryDetail.date}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>오늘의 기록</Text>
            <View
              style={[
                styles.emotionBadge,
                { backgroundColor: emotionColorMap[diaryDetail.emotion] },
              ]}
            >
              <Text style={styles.emotionBadgeText}>
                {emotionLabelMap[diaryDetail.emotion]}
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="날짜" value={diaryDetail.date} />
            <InfoItem label="감정" value={diaryDetail.emotion} />
            <InfoItem label="수면 시작" value={diaryDetail.sleepStart} />
            <InfoItem label="수면 종료" value={diaryDetail.sleepEnd} />
            <InfoItem label="총 수면시간" value={diaryDetail.sleepHours} />
            <InfoItem
              label="복약 여부"
              value={diaryDetail.tookMedicine ? '복용함' : '복용 안 함'}
              isLast
            />
          </View>
        </View>

        {diaryDetail.tookMedicine && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>복약 후 반응</Text>
            <Text style={styles.bodyText}>
              {diaryDetail.medicineReaction || '-'}
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>오늘의 일기</Text>
          <Text style={styles.bodyText}>{diaryDetail.diary}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>기록 정보</Text>
          <InfoItem
            label="생성일시"
            value={formattedCreatedAt}
            isLast={false}
          />
          <InfoItem label="수정일시" value={formattedUpdatedAt} isLast />
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={handleEditPress}
          >
            <Text style={styles.secondaryButtonText}>수정</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.pressed,
            ]}
            onPress={handleDeletePress}
          >
            <Text style={styles.deleteButtonText}>삭제</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>뒤로가기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

type InfoItemProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  isLast = false,
}) => {
  return (
    <View style={[styles.infoItem, isLast && styles.infoItemLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export default DiaryDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    color: '#6B7280',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  headerDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  emotionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  emotionBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  infoGrid: {
    gap: 0,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#111827',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginRight: 6,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginLeft: 6,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
  primaryButton: {
    backgroundColor: AppColor.main,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  retryButton: {
    backgroundColor: AppColor.main,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: Platform.OS === 'ios' ? 0.7 : 0.85,
  },
});
