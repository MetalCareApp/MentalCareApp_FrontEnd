import { StyleSheet, Text, View } from 'react-native';

function ChatBotScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Bot Screen</Text>
    </View>
  );
}

export default ChatBotScreen;

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
