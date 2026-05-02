import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainBottomTab from './src/navigations/MainBottomTab';
import Toast from 'react-native-toast-message';
import NotificationScreen from './src/screens/etc/NotificationScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';

const Stacks = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stacks.Navigator screenOptions={{ headerShown: false }}>
        <Stacks.Screen name="main" component={MainBottomTab} />
        <Stacks.Screen
          name="notification_list"
          component={NotificationScreen}
        />
        <Stacks.Screen name="login" component={LoginScreen} />
        <Stacks.Screen name="signup" component={SignUpScreen} />
      </Stacks.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;
