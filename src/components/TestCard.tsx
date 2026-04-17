import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TestCardProps {
  link: string;
  title: string;
  explanation: string;
  color: string;
}

function TestCard({ link, title, explanation, color }: TestCardProps) {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(link as never);
  };

  return (
    <Pressable style={styles.card} onPress={handlePress}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.explanationContainer, { backgroundColor: color }]}>
        <Text style={styles.explanation}>{explanation}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  explanation: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  explanationContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
  },
});

export default TestCard;
