import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { PHQ9_TEST_QUESTION_DATA } from '../../utils/TestData';
import TestQuestionCard from '../../components/TestQuestionCard';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { createPHQ9Examination } from '../../apis/examinationApi';
import CustomText from '../../components/common/CustomText';

function PHQ9TestScreen() {
  const navigation = useNavigation();

  const [scores, setScores] = useState<{ id: number; score: number }[]>([]);

  const onSetScore = (id: number, score: number) => () => {
    setScores(prevScores => {
      const existingScoreIndex = prevScores.findIndex(s => s.id === id);
      if (existingScoreIndex !== -1) {
        const updatedScores = [...prevScores];
        updatedScores[existingScoreIndex] = { id, score };
        return updatedScores;
      } else {
        return [...prevScores, { id, score }];
      }
    });
  };

  const onSubmit = async () => {
    if (scores.length < PHQ9_TEST_QUESTION_DATA.length) {
      Toast.show({
        type: 'error',
        text1: '모든 질문에 답변해주세요.',
        position: 'bottom',
      });
      return;
    }
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    const scoreList: number[] = [];
    for (let i = 1; i <= scores.length; i++) {
      const score = scores.filter(s => s.id === i)[0]?.score;
      scoreList.push(score);
    }
    await createPHQ9Examination(scoreList);
    // @ts-ignore
    navigation.navigate('phq9_test_result', { totalScore });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <CustomText weight="700" style={styles.title}>
          PHQ-9 우울 테스트
        </CustomText>
      </View>
      <FlatList
        style={styles.listContainer}
        data={PHQ9_TEST_QUESTION_DATA}
        renderItem={({ item }) => (
          <TestQuestionCard
            id={item.id}
            score={scores.filter(o => o.id === item.id)[0]?.score}
            question={item.question}
            onSetScore={onSetScore}
          />
        )}
        keyExtractor={({ id }) => id.toString()}
      />
      <Pressable style={styles.submitButton} onPress={onSubmit}>
        <CustomText weight="700" style={styles.submitButtonText}>
          결과 보기
        </CustomText>
      </Pressable>
    </View>
  );
}

export default PHQ9TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  titleWrapper: {
    width: '100%',
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: 'bold',
  },
});
