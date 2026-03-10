import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatBotScreen from '../screens/ChatBotScreen';
import TestStackNav from './TestStackNav';
import AppColor from '../utils/AppColor';
import ChatBotIcon from '../assets/icon/ChatBotIcon';
import TestIcon from '../assets/icon/TestIcon';
import DiaryIcon from '../assets/icon/DiaryIcon';
import HospitalIcon from '../assets/icon/HospitalIcon';
import UserCircleIcon from '../assets/icon/UserCircleIcon';

const BottomTab = createBottomTabNavigator();

const chatBotTabBarIcon = ({ focused }: { focused: boolean }) => (
  <ChatBotIcon color={focused ? AppColor.main : AppColor.textSub} />
);
const testTabBarIcon = ({ focused }: { focused: boolean }) => (
  <TestIcon color={focused ? AppColor.main : AppColor.textSub} />
);
const diaryTabBarIcon = ({ focused }: { focused: boolean }) => (
  <DiaryIcon color={focused ? AppColor.main : AppColor.textSub} />
);
const hospitalTabBarIcon = ({ focused }: { focused: boolean }) => (
  <HospitalIcon color={focused ? AppColor.main : AppColor.textSub} />
);
const myPageTabBarIcon = ({ focused }: { focused: boolean }) => (
  <UserCircleIcon color={focused ? AppColor.main : AppColor.textSub} />
);

function MainBottomTab() {
  return (
    <BottomTab.Navigator
      screenOptions={{ tabBarActiveTintColor: AppColor.main }}
    >
      <BottomTab.Screen
        name="chatBotNav"
        component={ChatBotScreen}
        options={{
          title: '챗봇',
          tabBarIcon: chatBotTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="testNav"
        component={TestStackNav}
        options={{ title: '테스트', tabBarIcon: testTabBarIcon }}
      />
      <BottomTab.Screen
        name="map"
        component={ChatBotScreen}
        options={{ title: '일기', tabBarIcon: diaryTabBarIcon }}
      />
      <BottomTab.Screen
        name="diaryNav"
        component={ChatBotScreen}
        options={{ title: '병원', tabBarIcon: hospitalTabBarIcon }}
      />
      <BottomTab.Screen
        name="myPageNav"
        component={ChatBotScreen}
        options={{ title: '마이페이지', tabBarIcon: myPageTabBarIcon }}
      />
    </BottomTab.Navigator>
  );
}

export default MainBottomTab;
