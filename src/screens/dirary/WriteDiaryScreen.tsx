import { StyleSheet, Text, View } from 'react-native';

function WriteDiaryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write Diary Screen</Text>
    </View>
  );
}

export default WriteDiaryScreen;

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
});
