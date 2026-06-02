import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { googleLogin } from '../../apis/authApi';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../stores/user';
import AppConstants from '../../utils/AppConstants';
import StorageHelper from '../../utils/StorageHelper';
import { getMyInfo } from '../../apis/userApi';
import GoogleIcon from '../../assets/icon/GoogleIcon';
import { getMyMatches } from '../../apis/matchApi';
import { useMatchStore } from '../../stores/match';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from '@env';
import CustomText from '../../components/common/CustomText';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);

  const { setUser, clearUserData } = useUserStore();

  useEffect(() => {
    StorageHelper.getData(AppConstants.STORAGE_KEYS.LOGIN_TOKEN).then(token => {
      if (token) {
        getMyInfo()
          .then(async info => {
            setUser({
              username: info.name,
              isDoctor: info.role === 'DOCTOR',
              email: info.email,
              matchId: info.matchId ?? null,
            });
            const matches = await getMyMatches();
            useMatchStore.getState().setMatches(matches);
            navigation.replace('main');
          })
          .catch(() => {
            clearUserData();
            StorageHelper.removeData(AppConstants.STORAGE_KEYS.LOGIN_TOKEN);
          });
      } else {
        clearUserData();
      }
    });
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const result: any = await GoogleSignin.signIn();

      console.log('Google signIn result:', result);

      const googleUser = result?.user ?? result?.data?.user;

      if (!googleUser) {
        throw new Error('구글 사용자 정보를 가져오지 못했습니다.');
      }

      const tokens = await GoogleSignin.getTokens();

      await googleLogin(tokens.idToken);
      await getMyInfo().then(async info => {
        setUser({
          username: info.name,
          isDoctor: info.role === 'DOCTOR',
          email: info.email,
          matchId: info.matchId ?? null,
        });
        const matches = await getMyMatches();
        useMatchStore.getState().setMatches(matches);
        navigation.replace('main');
      });
    } catch (error: any) {
      console.log('Google login error:', error);

      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      if (error?.code === statusCodes.IN_PROGRESS) {
        Alert.alert('알림', '로그인이 이미 진행 중입니다.');
        return;
      }

      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('오류', 'Google Play 서비스를 사용할 수 없습니다.');
        return;
      }

      Alert.alert(
        '로그인 실패',
        error?.message ?? '구글 로그인 중 오류가 발생했습니다.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <CustomText weight="700" style={styles.title}>
          시작하기
        </CustomText>

        <Image
          style={{
            width: 120,
            height: 120,
            marginBottom: 16,
            alignSelf: 'center',
          }}
          source={require('../../assets/images/remind_logo.png')}
        />

        <CustomText
          style={{
            fontSize: 16,
            color: '#6B7280',
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          구글 계정으로 간편하게 시작하세요.
        </CustomText>

        <Pressable
          style={({ pressed }) => [
            styles.googleButton,
            pressed && styles.pressed,
            isLoading && styles.disabledButton,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <GoogleIcon />
              <CustomText weight="700" style={styles.googleButtonText}>
                Google로 시작하기
              </CustomText>
            </View>
          )}
        </Pressable>

        <CustomText
          style={{
            fontSize: 12,
            color: '#6B7280',
            textAlign: 'center',
            marginVertical: 16,
            marginHorizontal: 20,
          }}
        >
          로그인 시 서비스 이용약관 및 개인정보처리 방침에 동의하는 것으로
          간주됩니다.
        </CustomText>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  container: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 32,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    // fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    // fontWeight: '700',
    color: '#111827',
  },
  disabledButton: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.7,
  },
});
