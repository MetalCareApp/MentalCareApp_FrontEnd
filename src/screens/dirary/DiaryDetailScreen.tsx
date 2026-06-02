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
import { deleteDiary, getDiaryDetail } from '../../apis/diaryApi';
import CustomText from '../../components/common/CustomText';

type RootStackParamList = {
  diary_detail: { diaryId: number };
};

type DiaryDetailRouteProp = RouteProp<RootStackParamList, 'diary_detail'>;

type EmotionType = 'GREAT' | 'GOOD' | 'NORMAL' | 'BAD' | 'VERY_BAD';

type DiaryDetail = {
  id: number;
  diaryDate: string;
  emotion: EmotionType;
  sleepStartTime: string;
  sleepEndTime: string;
  totalSleepMinutes: number;
  medicationTaken: boolean;
  medicationReaction: string;
  content: string;
  externalStress: boolean;
  createdAt: string;
  updatedAt: string;
};

const emotionLabelMap: Record<EmotionType, string> = {
  GREAT: '매우 좋음',
  GOOD: '좋음',
  NORMAL: '보통',
  BAD: '나쁨',
  VERY_BAD: '매우 나쁨',
};

const emotionColorMap: Record<EmotionType, string> = {
  GREAT: '#16A34A',
  GOOD: '#2563EB',
  NORMAL: '#6B7280',
  BAD: '#F59E0B',
  VERY_BAD: '#DC2626',
};

const DiaryDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
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

  const calculatedSleepHours = useMemo(() => {
    if (!diaryDetail) return '';
    let start = dayjs(diaryDetail.sleepStartTime);
    let end = dayjs(diaryDetail.sleepEndTime);

    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    const diffMinutes = end.diff(start, 'minute');
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}시간 ${minutes}분`;
  }, [diaryDetail]);

  useEffect(() => {
    const fetchDiaryDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getDiaryDetail(diaryId);
        setDiaryDetail(response);
      } catch (e) {
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
        setDiaryDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryDetail();
  }, [diaryId]);

  const handleRetry = async () => {
    setLoading(true);
    setError('');

    const response = await getDiaryDetail(diaryId);
    setDiaryDetail(response);

    setLoading(false);
  };

  const handleDeletePress = async () => {
    await deleteDiary(diaryId);
    Alert.alert('삭제 완료', '일기가 삭제되었습니다.');
    navigation.navigate('diary_calendar');
  };

  const handleEditPress = () => {
    //@ts-ignore
    navigation.navigate('diary_edit', { diaryId });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={AppColor.main} />
        <CustomText style={styles.loadingText}>
          일기 데이터를 불러오는 중입니다.
        </CustomText>
      </View>
    );
  }

  if (error || !diaryDetail) {
    return (
      <View style={styles.centerContainer}>
        <CustomText weight="700" style={styles.errorTitle}>
          불러오지 못했습니다
        </CustomText>
        <CustomText style={styles.errorDescription}>
          {error || '일기 데이터를 찾을 수 없습니다.'}
        </CustomText>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={handleRetry}
        >
          <CustomText weight="700" style={styles.retryButtonText}>
            다시 시도
          </CustomText>
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
          <CustomText weight="700" style={styles.headerTitle}>
            일기 상세
          </CustomText>
          <CustomText style={styles.headerDate}>
            {diaryDetail.diaryDate}
          </CustomText>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <CustomText weight="700" style={styles.sectionTitle}>
              오늘의 기록
            </CustomText>
            <View
              style={[
                styles.emotionBadge,
                { backgroundColor: emotionColorMap[diaryDetail.emotion] },
              ]}
            >
              <CustomText weight="700" style={styles.emotionBadgeText}>
                {emotionLabelMap[diaryDetail.emotion]}
              </CustomText>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <InfoItem label="날짜" value={diaryDetail.diaryDate} />
            <InfoItem
              label="감정"
              value={emotionLabelMap[diaryDetail.emotion]}
            />
            <InfoItem
              label="수면 시작"
              value={dayjs(diaryDetail.sleepStartTime).format('HH:mm')}
            />
            <InfoItem
              label="수면 종료"
              value={dayjs(diaryDetail.sleepEndTime).format('HH:mm')}
            />
            <InfoItem label="총 수면시간" value={calculatedSleepHours} />
            <InfoItem
              label="외부 스트레스 요인"
              value={diaryDetail.externalStress ? '있음' : '없음'}
            />
            <InfoItem
              label="복약 여부"
              value={diaryDetail.medicationTaken ? '복용함' : '복용 안 함'}
              isLast
            />
          </View>
        </View>

        {diaryDetail.medicationTaken && (
          <View style={styles.card}>
            <CustomText weight="700" style={styles.sectionTitle}>
              복약 후 반응
            </CustomText>
            <CustomText style={styles.bodyText}>
              {diaryDetail.medicationReaction || '-'}
            </CustomText>
          </View>
        )}

        <View style={styles.card}>
          <CustomText weight="700" style={styles.sectionTitle}>
            오늘의 일기
          </CustomText>
          <CustomText style={styles.bodyText}>{diaryDetail.content}</CustomText>
        </View>

        <View style={styles.card}>
          <CustomText weight="700" style={styles.sectionTitle}>
            기록 정보
          </CustomText>
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
            <CustomText weight="700" style={styles.secondaryButtonText}>
              수정
            </CustomText>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.pressed,
            ]}
            onPress={handleDeletePress}
          >
            <CustomText weight="700" style={styles.deleteButtonText}>
              삭제
            </CustomText>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <CustomText weight="700" style={styles.primaryButtonText}>
            뒤로가기
          </CustomText>
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
      <CustomText style={styles.infoLabel}>{label}</CustomText>
      <CustomText weight="600" style={styles.infoValue}>
        {value}
      </CustomText>
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '600',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
  },
  pressed: {
    opacity: Platform.OS === 'ios' ? 0.7 : 0.85,
  },
});
