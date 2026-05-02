import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../screens/mypage/MyPage';
import FavoriteHospitalsScreen from '../screens/mypage/FavoriteHospitalsScreen';
import MyReportListScreen from '../screens/mypage/MyReportListScreen';
import MyTestResultListScreen from '../screens/mypage/MyTestResultListScreen';
import MyHospitalManageScreen from '../screens/mypage/MyHospitalManageScreen';
import MyPatientListScreen from '../screens/mypage/MyPatientListScreen';
import PatientDetailScreen from '../screens/mypage/PatientDetailScreen';
import ReportDetailScreen from '../screens/etc/ReportDetailScreen';
import ResisterPatientScreen from '../screens/mypage/ResisterPatientScreen';
import DoctorSignupScreen from '../screens/mypage/DoctorSignUpScreen';

const Stacks = createNativeStackNavigator();

function MyPageStackNav() {
  return (
    <Stacks.Navigator screenOptions={{ headerShown: false }}>
      <Stacks.Screen name="my_page" component={MyPageScreen} />

      <Stacks.Screen
        name="favorite_hospitals"
        component={FavoriteHospitalsScreen}
      />
      <Stacks.Screen
        name="my_hospital_manage"
        component={MyHospitalManageScreen}
      />
      <Stacks.Screen name="report_list" component={MyReportListScreen} />
      <Stacks.Screen
        name="test_result_list"
        component={MyTestResultListScreen}
      />

      <Stacks.Screen
        name="register_patient"
        component={ResisterPatientScreen}
      />
      <Stacks.Screen name="patient_list" component={MyPatientListScreen} />
      <Stacks.Screen name="patient_detail" component={PatientDetailScreen} />
      <Stacks.Screen name="doctor_signup" component={DoctorSignupScreen} />

      <Stacks.Screen name="report_detail" component={ReportDetailScreen} />
    </Stacks.Navigator>
  );
}

export default MyPageStackNav;
