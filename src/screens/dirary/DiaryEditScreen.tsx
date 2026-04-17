import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import DiaryForm, { DiaryFormValues } from '../../components/diary/DiaryForm';

type RootStackParamList = {
  diary_edit: { diaryId: number };
  diary_detail: { diaryId: number };
};

type DiaryEditRouteProp = RouteProp<RootStackParamList, 'diary_edit'>;

type DiaryDetail = {
  id: number;
  date: string;
  emotion: string;
  sleepStart: string;
  sleepEnd: string;
  sleepHours: string;
  tookMedicine: boolean;
  medicineReaction: string;
  diary: string;
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
  },
];

const DiaryEditScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<DiaryEditRouteProp>();
  const { diaryId } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [initialValues, setInitialValues] = useState<DiaryFormValues | null>(
    null,
  );

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연동 시 diaryId로 수정 대상 데이터 조회
        // const response = await api.get(`/diaries/${diaryId}`);
        // const data = response.data;

        const data = DUMMY_DIARY_DATA.find(item => item.id === diaryId);

        if (!data) {
          setError('수정할 일기 데이터를 찾을 수 없습니다.');
          setInitialValues(null);
          return;
        }

        const mappedValues: DiaryFormValues = {
          date: dayjs(data.date, 'YYYY-MM-DD').toDate(),
          emotion: data.emotion,
          sleepStart: dayjs(
            `${data.date} ${data.sleepStart}`,
            'YYYY-MM-DD HH:mm',
          ).toDate(),
          sleepEnd: dayjs(
            `${data.date} ${data.sleepEnd}`,
            'YYYY-MM-DD HH:mm',
          ).toDate(),
          tookMedicine: data.tookMedicine,
          medicineReaction: data.medicineReaction,
          diary: data.diary,
        };

        setInitialValues(mappedValues);
      } catch (e) {
        setError('일기 데이터를 불러오는 중 오류가 발생했습니다.');
        setInitialValues(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [diaryId]);

  const handleEdit = async (values: {
    date: string;
    emotion: string;
    sleepStart: string;
    sleepEnd: string;
    sleepHours: string;
    tookMedicine: boolean;
    medicineReaction: string;
    diary: string;
  }) => {
    try {
      // TODO:
      // 서버 연동 시 수정 API 호출
      // await api.put(`/diaries/${diaryId}`, values);

      console.log('일기 수정:', diaryId, values);
      Alert.alert('수정 완료', '일기가 수정되었습니다.');
      navigation.navigate('diary_detail', { diaryId });
    } catch (error) {
      Alert.alert('오류', '일기 수정 중 문제가 발생했습니다.');
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');

    const data = DUMMY_DIARY_DATA.find(item => item.id === diaryId);

    if (!data) {
      setError('수정할 일기 데이터를 찾을 수 없습니다.');
      setInitialValues(null);
      setLoading(false);
      return;
    }

    const mappedValues: DiaryFormValues = {
      date: dayjs(data.date, 'YYYY-MM-DD').toDate(),
      emotion: data.emotion,
      sleepStart: dayjs(
        `${data.date} ${data.sleepStart}`,
        'YYYY-MM-DD HH:mm',
      ).toDate(),
      sleepEnd: dayjs(
        `${data.date} ${data.sleepEnd}`,
        'YYYY-MM-DD HH:mm',
      ).toDate(),
      tookMedicine: data.tookMedicine,
      medicineReaction: data.medicineReaction,
      diary: data.diary,
    };

    setInitialValues(mappedValues);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>수정할 일기를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !initialValues) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>
          {error || '수정할 일기 데이터를 찾을 수 없습니다.'}
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
    <DiaryForm
      mode="edit"
      initialValues={initialValues}
      submitButtonText="수정하기"
      onSubmit={handleEdit}
    />
  );
};

export default DiaryEditScreen;

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
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
    opacity: 0.7,
  },
});
