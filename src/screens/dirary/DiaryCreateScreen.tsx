import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DiaryForm from '../../components/diary/DiaryForm';
import { createDiary } from '../../apis/diaryApi';

const DiaryCreateScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCreate = async (values: {
    diaryDate: string;
    emotion: string;
    sleepStartTime: string;
    sleepEndTime: string;
    // sleepHours: string;
    medicationTaken: boolean;
    medicationReaction: string;
    content: string;
    externalStress: boolean;
  }) => {
    try {
      const response = await createDiary(values);

      console.log('신규 일기 생성:', values);
      Alert.alert('저장 완료', '일기가 저장되었습니다.');
      navigation.navigate('diary_detail', { diaryId: response.id });
    } catch (error) {
      Alert.alert(
        '오류',
        `일기 저장 중 문제가 발생했습니다. error: ${JSON.stringify(error)}`,
      );
    }
  };

  return (
    <DiaryForm
      mode="create"
      submitButtonText="저장하기"
      onSubmit={handleCreate}
    />
  );
};

export default DiaryCreateScreen;
