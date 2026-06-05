import { View, StyleSheet, Pressable } from 'react-native';
import CustomText from './common/CustomText';

interface PSSTestQuestionCardProps {
  id: number;
  question: string;
  isPositive: boolean;
  score?: number;
  onSetScore?: (id: number, score: number) => () => void;
}

function PSSTestQuestionCard({
  id,
  question,
  isPositive,
  score,
  onSetScore,
}: PSSTestQuestionCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <CustomText>{`${id}. `}</CustomText>
        <CustomText>{question}</CustomText>
      </View>
      <View style={styles.answerContainer}>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, isPositive ? 4 : 0)}
        >
          <View
            style={[
              styles.checkbox,
              (isPositive && score === 4) || (!isPositive && score === 0)
                ? styles.checked
                : null,
            ]}
          />
          <CustomText>전혀 없었다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, isPositive ? 3 : 1)}
        >
          <View
            style={[
              styles.checkbox,
              (isPositive && score === 3) || (!isPositive && score === 1)
                ? styles.checked
                : null,
            ]}
          />
          <CustomText>거의 없었다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, 2)}
        >
          <View style={[styles.checkbox, score === 2 && styles.checked]} />
          <CustomText>때때로 있었다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, isPositive ? 1 : 3)}
        >
          <View
            style={[
              styles.checkbox,
              (isPositive && score === 1) || (!isPositive && score === 3)
                ? styles.checked
                : null,
            ]}
          />
          <CustomText>자주 있었다</CustomText>
        </Pressable>
        <Pressable
          style={styles.answerOption}
          onPress={onSetScore && onSetScore(id, isPositive ? 0 : 4)}
        >
          <View
            style={[
              styles.checkbox,
              (isPositive && score === 0) || (!isPositive && score === 4)
                ? styles.checked
                : null,
            ]}
          />
          <CustomText>매우 자주 있었다</CustomText>
        </Pressable>
      </View>
    </View>
  );
}

export default PSSTestQuestionCard;

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
