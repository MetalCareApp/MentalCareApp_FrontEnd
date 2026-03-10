import { Text, View, StyleSheet, Pressable } from 'react-native';

interface TestQuestionCardProps {
  id: number;
  question: string;
  score?: number;
  onSetScore?: (id: number, score: number) => () => void;
}

function TestQuestionCard({
  id,
  question,
  score,
  onSetScore,
}: TestQuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text>{`${id}. `}</Text>
        <Text>{question}</Text>
      </View>
      <View style={styles.answerContainer}>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 0)}
        >
          <View style={[styles.checkbox, score === 0 && styles.checked]} />
          <Text>전혀 아니다</Text>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 1)}
        >
          <View style={[styles.checkbox, score === 1 && styles.checked]} />
          <Text>며칠 동안</Text>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 2)}
        >
          <View style={[styles.checkbox, score === 2 && styles.checked]} />
          <Text>일주일 이상</Text>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 3)}
        >
          <View style={[styles.checkbox, score === 3 && styles.checked]} />
          <Text>거의 매일</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default TestQuestionCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  answerContainer: {
    justifyContent: 'space-around',
    marginTop: 6,
  },
  answerOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 14,
    height: 14,
    borderRadius: '100%',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#333',
  },
});
