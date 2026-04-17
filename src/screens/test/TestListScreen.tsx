import { FlatList, StyleSheet, Text, View } from 'react-native';
import TestCard from '../../components/TestCard';

function TestScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>마인드 심리테스트</Text>
      </View>

      <FlatList
        style={styles.listContainer}
        data={[
          {
            id: 1,
            link: 'phq9_test',
            title: 'PHQ-9 우울 테스트',
            explanation: '우울증을 진단하기 위한 테스트입니다.',
            color: '#6FB7E9',
          },
          {
            id: 2,
            link: 'gad7_test',
            title: 'GAD-7 불안 테스트',
            explanation: '불안장애를 진단하기 위한 테스트입니다.',
            color: '#E45757',
          },
        ]}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <TestCard
            link={item.link}
            title={item.title}
            explanation={item.explanation}
            color={item.color}
          />
        )}
      />
    </View>
  );
}

export default TestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    width: '100%',
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    padding: 20,
  },
});
