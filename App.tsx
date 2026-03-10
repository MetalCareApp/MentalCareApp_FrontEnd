import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainBottomTab from './src/navigations/MainBottomTab';
import Toast from 'react-native-toast-message';

const Stacks = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stacks.Navigator screenOptions={{ headerShown: false }}>
        <Stacks.Screen name="Main" component={MainBottomTab} />
      </Stacks.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;
