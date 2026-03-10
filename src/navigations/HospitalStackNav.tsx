import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HospitalListScreen from '../screens/hospital/HospitalListScreen';
import HospitalDetailScreen from '../screens/hospital/HospitalDetailScreen';

const Stacks = createNativeStackNavigator();

function HospitalStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="hospital_list" component={HospitalListScreen} />
      <Stacks.Screen name="hospital_detail" component={HospitalDetailScreen} />
    </Stacks.Navigator>
  );
}

export default HospitalStackNav;
