import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
  User,
} from '@react-native-google-signin/google-signin';
import GoogleIcon from '../../assets/icon/GoogleIcon';

type GoogleLoginResult = {
  user: User;
  idToken: string | null;
};

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      // TODO:
      // 실제 발급받은 Web Client ID로 교체
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',

      // iOS 오프라인 액세스나 서버 인증이 필요할 때 사용
      offlineAccess: true,
    });
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      await GoogleSignin.hasPlayServices();

      const result = await GoogleSignin.signIn();

      // 버전별 응답 형태 차이를 안전하게 처리
      const user = 'data' in result ? result.data?.user : (result as any).user;
      const tokens = await GoogleSignin.getTokens();

      const loginResult: GoogleLoginResult = {
        user,
        idToken: tokens.idToken ?? null,
      };

      // TODO:
      // 서버 연동 시 이 부분에서 idToken을 서버로 보내 검증/로그인 처리
      // await api.post("/auth/google", { idToken: loginResult.idToken });

      console.log('구글 로그인 성공:', loginResult);

      Alert.alert(
        '로그인 성공',
        `${loginResult.user.user.name ?? '사용자'}님 환영합니다.`,
      );
    } catch (error: any) {
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

      Alert.alert('로그인 실패', '구글 로그인 중 문제가 발생했습니다.');
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>로그인</Text>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/images/remind_logo.png')}
            style={{ width: 120, height: 120 }}
          />
        </View>

        <Text style={styles.description}>
          구글 계정으로 간편하게 시작하세요.
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.googleButton,
            pressed && !isLoading && styles.pressed,
            isLoading && styles.googleButtonDisabled,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#111827" />
          ) : (
            <>
              <GoogleIcon />
              <Text style={styles.googleButtonText}>Google로 로그인</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.helperText}>
          {`로그인 시 서비스 이용약관 및 개인정보처리방침에
          동의한 것으로 간주됩니다.`}
        </Text>
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
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  googleButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    columnGap: 10,
  },
  googleButtonDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  helperText: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
