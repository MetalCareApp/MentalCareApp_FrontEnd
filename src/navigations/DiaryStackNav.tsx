import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DiaryCalendarScreen from '../screens/dirary/DiaryCalendarScreen';
import WriteDiaryScreen from '../screens/dirary/WriteDiaryScreen';
import DiaryDetailScreen from '../screens/dirary/DiaryDetailScreen';

const Stacks = createNativeStackNavigator();

function DiaryStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="diary_calendar" component={DiaryCalendarScreen} />
      <Stacks.Screen name="write_diary" component={WriteDiaryScreen} />
      <Stacks.Screen name="diary_detail" component={DiaryDetailScreen} />
    </Stacks.Navigator>
  );
}

export default DiaryStackNav;
