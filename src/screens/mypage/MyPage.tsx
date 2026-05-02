import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../stores/user'; // 경로 맞게 수정

const DUMMY_DATA = {
  username: '홍길동',
  isDoctor: true, //TODO - 실제 로그인 시 서버에서 받아와야 함
};

const MyPageScreen: React.FC = () => {
  useEffect(() => {
    setUser(DUMMY_DATA.username, DUMMY_DATA.isDoctor);
  }, []);

  const navigation = useNavigation<any>();

  const { username, isDoctor, currentMode, switchMode, setUser } =
    useUserStore();

  /* ---------------- 일반 사용자 메뉴 ---------------- */

  const handleFavoriteHospitals = () => {
    navigation.navigate('favorite_hospitals');
  };

  const handleReports = () => {
    navigation.navigate('report_list');
  };

  const handleTests = () => {
    navigation.navigate('test_result_list');
  };

  const handleMyHospital = () => {
    navigation.navigate('my_hospital_manage');
  };

  /* ---------------- 의사 메뉴 ---------------- */

  const handlePatients = () => {
    navigation.navigate('patient_list');
  };

  const handleResisterPatient = () => {
    navigation.navigate('register_patient');
  };

  /* ---------------- 의사 전환 ---------------- */

  const handleDoctorSwitch = () => {
    if (isDoctor) {
      switchMode('DOCTOR');
      return;
    }

    navigation.navigate('doctor_signup');
  };

  const handleBackToUserMode = () => {
    switchMode('USER');
  };

  return (
    <View style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.userName}>{username ?? '사용자'}</Text>

        <Text style={styles.userSubText}>
          {currentMode === 'DOCTOR' ? '의사 모드' : '일반 사용자'}
        </Text>
      </View>

      {/* 메뉴 */}
      <View style={styles.menuSection}>
        {currentMode === 'DOCTOR' ? (
          <>
            <MenuItem title="나의 환자 목록" onPress={handlePatients} />
            <MenuItem
              title="환자 등록하기"
              onPress={handleResisterPatient}
              isLast
            />
          </>
        ) : (
          <>
            <MenuItem title="나의 병원 관리" onPress={handleMyHospital} />
            <MenuItem
              title="찜한 병원 목록"
              onPress={handleFavoriteHospitals}
            />
            <MenuItem title="나의 리포트 목록" onPress={handleReports} />
            <MenuItem title="테스트 결과 목록" onPress={handleTests} isLast />
          </>
        )}
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomSection}>
        {currentMode === 'DOCTOR' ? (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={handleBackToUserMode}
          >
            <Text style={styles.secondaryButtonText}>일반 모드로 돌아가기</Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
            onPress={handleDoctorSwitch}
          >
            <Text style={styles.primaryButtonText}>
              {isDoctor ? '의사 모드로 전환하기' : '의사 회원으로 전환하기'}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default MyPageScreen;

/* ---------------- Menu Item ---------------- */

type MenuItemProps = {
  title: string;
  onPress: () => void;
  isLast?: boolean;
};

const MenuItem: React.FC<MenuItemProps> = ({
  title,
  onPress,
  isLast = false,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        !isLast && styles.menuItemBorder,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.menuText}>{title}</Text>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
};

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },

  userSubText: {
    fontSize: 13,
    color: '#6B7280',
  },

  menuSection: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },

  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  menuText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },

  arrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },

  bottomSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },

  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
  },

  pressed: {
    opacity: 0.7,
  },
});
