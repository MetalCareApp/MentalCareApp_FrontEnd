import GAD7TestResultScreen from '../screens/test/GAD7TestResultScreen';
import GAD7TestScreen from '../screens/test/GAD7TestScreen';
import PHQ9TestResultScreen from '../screens/test/PHQ9TestResultScreen';
import PHQ9TestScreen from '../screens/test/PHQ9TestScreen';
import TestScreen from '../screens/test/TestScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stacks = createNativeStackNavigator();

function TestStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen
        name="test"
        component={TestScreen}
        options={{ title: '테스트' }}
      />
      <Stacks.Screen
        name="phq9_test"
        component={PHQ9TestScreen}
        options={{ title: 'PHQ-9 우울 테스트' }}
      />
      <Stacks.Screen
        name="gad7_test"
        component={GAD7TestScreen}
        options={{ title: 'GAD-7 불안 테스트' }}
      />
      <Stacks.Screen
        name="phq9_test_result"
        component={PHQ9TestResultScreen}
        options={{ title: 'PHQ-9 테스트 결과' }}
      />
      <Stacks.Screen
        name="gad7_test_result"
        component={GAD7TestResultScreen}
        options={{ title: 'GAD-7 테스트 결과' }}
      />
    </Stacks.Navigator>
  );
}

export default TestStackNav;
