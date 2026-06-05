import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ADHD_TEST_QUESTION_DATA } from '../../utils/TestData';
import { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { createADHDExamination } from '../../apis/examinationApi';
import CustomText from '../../components/common/CustomText';
import ADHDTestQuestionCard from '../../components/ADHDTestQuestionCard';

function ADHDTestScreen() {
  const navigation = useNavigation();

  const [scores, setScores] = useState<{ id: number; score: number }[]>([]);
  console.log('Current scores state:', scores);
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
    if (scores.length < ADHD_TEST_QUESTION_DATA.length) {
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
    await createADHDExamination(scoreList);
    // @ts-ignore
    navigation.navigate('adhd_test_result', { totalScore });
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <CustomText weight="700" style={styles.title}>
          ADHD 테스트
        </CustomText>
      </View>
      <FlatList
        style={styles.listContainer}
        data={ADHD_TEST_QUESTION_DATA}
        renderItem={({ item }) => (
          <ADHDTestQuestionCard
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

export default ADHDTestScreen;

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
