import { useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { KMDQ_TEST_RESULT_DATA } from '../../utils/TestData';
import { useEffect, useState } from 'react';
import CustomText from '../../components/common/CustomText';

function KMDQTestResultScreen() {
  const route = useRoute();
  const { totalScore } = route.params as { totalScore: number };

  const [resultDataIndex, setResultDataIndex] = useState<number | null>(null);

  useEffect(() => {
    const index = KMDQ_TEST_RESULT_DATA.findIndex(
      d => totalScore >= d.minimum && totalScore <= d.maximum,
    );
    setResultDataIndex(index);
  }, [totalScore]);

  return (
    <View style={styles.container}>
      <CustomText weight="700" style={styles.title}>
        K-MDQ 테스트 결과
      </CustomText>
      <CustomText style={styles.score}>총 점수: {totalScore}</CustomText>
      <CustomText style={styles.level}>
        조울증 여부:{' '}
        {resultDataIndex !== null
          ? KMDQ_TEST_RESULT_DATA[resultDataIndex].tag
          : '결과 없음'}
      </CustomText>
      <CustomText style={styles.explanation}>
        {resultDataIndex !== null
          ? KMDQ_TEST_RESULT_DATA[resultDataIndex].result
          : '결과 없음'}
      </CustomText>
    </View>
  );
}

export default KMDQTestResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    marginTop: 20,
  },
  level: {
    fontSize: 18,
    marginTop: 10,
    color: 'red',
  },
  explanation: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
