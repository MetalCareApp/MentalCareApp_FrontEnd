import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatBotScreen from '../screens/chatbot/ChatBotScreen';
import TestStackNav from './TestStackNav';
import AppColor from '../utils/AppColor';
import ChatBotIcon from '../assets/icon/ChatBotIcon';
import TestIcon from '../assets/icon/TestIcon';
import DiaryIcon from '../assets/icon/DiaryIcon';
import HospitalIcon from '../assets/icon/HospitalIcon';
import UserCircleIcon from '../assets/icon/UserCircleIcon';
import DiaryStackNav from './DiaryStackNav';
import HospitalStackNav from './HospitalStackNav';
import MyPageStackNav from './MyPageStackNav';

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
      screenOptions={{
        tabBarActiveTintColor: AppColor.main,
        headerTitleAlign: 'center',
      }}
    >
      <BottomTab.Screen
        name="chat_bot_nav"
        component={ChatBotScreen}
        options={{
          title: '챗봇',
          tabBarIcon: chatBotTabBarIcon,
        }}
      />
      <BottomTab.Screen
        name="test_nav"
        component={TestStackNav}
        options={{ title: '테스트', tabBarIcon: testTabBarIcon }}
      />
      <BottomTab.Screen
        name="diary_nav"
        component={DiaryStackNav}
        options={{ title: '일기', tabBarIcon: diaryTabBarIcon }}
      />
      <BottomTab.Screen
        name="hospital_nav"
        component={HospitalStackNav}
        options={{ title: '병원', tabBarIcon: hospitalTabBarIcon }}
      />
      <BottomTab.Screen
        name="my_page_nav"
        component={MyPageStackNav}
        options={{ title: '마이페이지', tabBarIcon: myPageTabBarIcon }}
      />
    </BottomTab.Navigator>
  );
}

export default MainBottomTab;
