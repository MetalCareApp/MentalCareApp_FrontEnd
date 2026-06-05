import { View, StyleSheet, Pressable } from 'react-native';
import CustomText from './common/CustomText';

interface ADHDTestQuestionCardProps {
  id: number;
  question: string;
  score?: number;
  onSetScore?: (id: number, score: number) => () => void;
}

function ADHDTestQuestionCard({
  id,
  question,
  score,
  onSetScore,
}: ADHDTestQuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <CustomText>{`${id}. `}</CustomText>
        <CustomText>{question}</CustomText>
      </View>
      <View style={styles.answerContainer}>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 0)}
        >
          <View style={[styles.checkbox, score === 0 && styles.checked]} />
          <CustomText>전혀 아니다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 1)}
        >
          <View style={[styles.checkbox, score === 1 && styles.checked]} />
          <CustomText>때때로 그렇다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 2)}
        >
          <View style={[styles.checkbox, score === 2 && styles.checked]} />
          <CustomText>자주 그렇다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 3)}
        >
          <View style={[styles.checkbox, score === 3 && styles.checked]} />
          <CustomText>매우 자주 그렇다</CustomText>
        </Pressable>
      </View>
    </View>
  );
}

export default ADHDTestQuestionCard;

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
