import ADHDTestResultScreen from '../screens/test/ADHDTestResultScreen';
import ADHDTestScreen from '../screens/test/ADHDTestScreen';
import GAD7TestResultScreen from '../screens/test/GAD7TestResultScreen';
import GAD7TestScreen from '../screens/test/GAD7TestScreen';
import KMDQTestResultScreen from '../screens/test/KMDQTestResultScreen';
import KMDQTestScreen from '../screens/test/KMDQTestScreen';
import PHQ9TestResultScreen from '../screens/test/PHQ9TestResultScreen';
import PHQ9TestScreen from '../screens/test/PHQ9TestScreen';
import PSSTestResultScreen from '../screens/test/PSSTestResultScreen';
import PSSTestScreen from '../screens/test/PSSTestScreen';
import TestListScreen from '../screens/test/TestListScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stacks = createNativeStackNavigator();

function TestStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen
        name="test_list"
        component={TestListScreen}
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
      <Stacks.Screen
        name="pss_test"
        component={PSSTestScreen}
        options={{ title: 'PSS 스트레스 테스트' }}
      />
      <Stacks.Screen
        name="pss_test_result"
        component={PSSTestResultScreen}
        options={{ title: 'PSS 테스트 결과' }}
      />
      <Stacks.Screen
        name="kmdq_test"
        component={KMDQTestScreen}
        options={{ title: 'K-MDQ 조울증 테스트' }}
      />
      <Stacks.Screen
        name="kmdq_test_result"
        component={KMDQTestResultScreen}
        options={{ title: 'K-MDQ 테스트 결과' }}
      />
      <Stacks.Screen
        name="adhd_test"
        component={ADHDTestScreen}
        options={{ title: 'ADHD 테스트' }}
      />
      <Stacks.Screen
        name="adhd_test_result"
        component={ADHDTestResultScreen}
        options={{ title: 'ADHD 테스트 결과' }}
      />
    </Stacks.Navigator>
  );
}

export default TestStackNav;
