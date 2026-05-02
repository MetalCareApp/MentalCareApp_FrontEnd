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
import { Pressable, StyleSheet, Text, View } from 'react-native';
import NotificationIcon from '../assets/icon/NotificationIcon';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation<any>();

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: AppColor.main,
        headerTitleAlign: 'center',
        headerRight: () => (
          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.pressed,
            ]}
            onPress={() => navigation.navigate('notification_list')}
          >
            <NotificationIcon width={24} height={24} color="black" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>1</Text>
            </View>
          </Pressable>
        ),
        headerRightContainerStyle: {
          paddingRight: 16,
        },
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

const styles = StyleSheet.create({
  notificationButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: AppColor.text.error,
    borderRadius: '100%',
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
