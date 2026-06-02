import { StyleSheet, Text, View } from 'react-native';
import CustomText from '../../components/common/CustomText';

function SignUpScreen() {
  return (
    <View style={styles.container}>
      <CustomText weight="700" style={styles.title}>
        SignUp Screen
      </CustomText>
    </View>
  );
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    width: '100%',
    padding: 20,
    paddingBottom: 0,
  },
  title: {
    fontSize: 20,
    // fontWeight: 'bold',
  },
});
