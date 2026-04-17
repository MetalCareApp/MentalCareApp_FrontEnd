import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DiaryForm from '../../components/diary/DiaryForm';

const DiaryCreateScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleCreate = async (values: {
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
      // 서버 연동 시 생성 API 호출
      // await api.post("/diaries", values);

      console.log('신규 일기 생성:', values);
      Alert.alert('저장 완료', '일기가 저장되었습니다.');
      navigation.navigate('diary_nav');
    } catch (error) {
      Alert.alert('오류', '일기 저장 중 문제가 발생했습니다.');
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
