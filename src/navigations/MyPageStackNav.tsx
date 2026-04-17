import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../screens/mypage/MyPage';
import FavoriteHospitalsScreen from '../screens/mypage/FavoriteHospitalsScreen';

const Stacks = createNativeStackNavigator();

function MyPageStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="my_page" component={MyPageScreen} />

      <Stacks.Screen
        name="favorite_hospitals"
        component={FavoriteHospitalsScreen}
      />
      {/* <Stacks.Screen name="report_list" component={MyReportListScreen} />
      <Stacks.Screen name="test_result_list" component={MyTestResultListScreen} />

      <Stacks.Screen name="create_report" component={CreateReportScreen} />
      <Stacks.Screen name="patient_list" component={MyPatientListScreen} />
      <Stacks.Screen name="doctor_signup" component={DoctorSignupScreen} /> */}
    </Stacks.Navigator>
  );
}

export default MyPageStackNav;
