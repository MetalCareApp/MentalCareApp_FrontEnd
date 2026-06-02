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
import { getDiaryDetail, updateDiary } from '../../apis/diaryApi';

type RootStackParamList = {
  diary_edit: { diaryId: number };
  diary_detail: { diaryId: number };
};

type DiaryEditRouteProp = RouteProp<RootStackParamList, 'diary_edit'>;

// type DiaryDetail = {
//   id: number;
//   date: string;
//   emotion: string;
//   sleepStart: string;
//   sleepEnd: string;
//   sleepHours: string;
//   tookMedicine: boolean;
//   medicineReaction: string;
//   diary: string;
//   externalStress: boolean;
// };

const emotionsConvertMap = {
  GREAT: '매우 좋음',
  GOOD: '좋음',
  NORMAL: '보통',
  BAD: '나쁨',
  VERY_BAD: '매우 나쁨',
};

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

        const data = await getDiaryDetail(diaryId);
        console.log('getDiaryDetail API result:', data);

        if (!data) {
          setError('수정할 일기 데이터를 찾을 수 없습니다.');
          setInitialValues(null);
          return;
        }
        console.log('aaaa', `${data.diaryDate}, ${data.sleepStartTime}`);
        const mappedValues: DiaryFormValues = {
          diaryDate: dayjs(data.date, 'YYYY-MM-DD').toDate(),
          emotion:
            emotionsConvertMap[data.emotion as keyof typeof emotionsConvertMap],
          sleepStartTime: dayjs(
            `${data.sleepStartTime}`,
            'YYYY-MM-DD HH:mm',
          ).toDate(),
          sleepEndTime: dayjs(
            `${data.sleepEndTime}`,
            'YYYY-MM-DD HH:mm',
          ).toDate(),
          medicationTaken: data.medicationTaken,
          medicationReaction: data.medicationReaction,
          content: data.content,
          externalStress: data.externalStress,
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
    diaryDate: string;
    emotion: string;
    sleepStartTime: string;
    sleepEndTime: string;
    medicationTaken: boolean;
    medicationReaction: string;
    content: string;
    externalStress: boolean;
  }) => {
    try {
      console.log('handleEdit called with values:', values);
      await updateDiary(diaryId, values);

      console.log('일기 수정:', diaryId, values);
      Alert.alert('수정 완료', '일기가 수정되었습니다.');
      navigation.navigate('diary_detail', { diaryId });
    } catch (error) {
      Alert.alert(
        '오류',
        `일기 수정 중 문제가 발생했습니다.${JSON.stringify(error)}`,
      );
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError('');

    const data = await getDiaryDetail(diaryId);

    if (!data) {
      setError('수정할 일기 데이터를 찾을 수 없습니다.');
      setInitialValues(null);
      setLoading(false);
      return;
    }

    const mappedValues: DiaryFormValues = {
      diaryDate: dayjs(data.diaryDate, 'YYYY-MM-DD').toDate(),
      emotion:
        emotionsConvertMap[data.emotion as keyof typeof emotionsConvertMap],
      sleepStartTime: dayjs(
        `${data.diaryDate} ${data.sleepStartTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate(),
      sleepEndTime: dayjs(
        `${data.diaryDate} ${data.sleepEndTime}`,
        'YYYY-MM-DD HH:mm',
      ).toDate(),
      medicationTaken: data.medicationTaken,
      medicationReaction: data.medicationReaction,
      content: data.content,
      externalStress: data.externalStress,
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
