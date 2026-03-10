import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../screens/mypage/MyPage';

const Stacks = createNativeStackNavigator();

function MyPageStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="my_page" component={MyPageScreen} />
    </Stacks.Navigator>
  );
}

export default MyPageStackNav;
