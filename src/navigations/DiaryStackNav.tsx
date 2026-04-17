import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryCalendarScreen from '../screens/dirary/DiaryCalendarScreen';
import DiaryDetailScreen from '../screens/dirary/DiaryDetailScreen';
import DiaryCreateScreen from '../screens/dirary/DiaryCreateScreen';
import DiaryEditScreen from '../screens/dirary/DiaryEditScreen';

const Stacks = createNativeStackNavigator();

function DiaryStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="diary_calendar" component={DiaryCalendarScreen} />
      <Stacks.Screen name="diary_create" component={DiaryCreateScreen} />
      <Stacks.Screen name="diary_edit" component={DiaryEditScreen} />
      <Stacks.Screen name="diary_detail" component={DiaryDetailScreen} />
    </Stacks.Navigator>
  );
}

export default DiaryStackNav;
