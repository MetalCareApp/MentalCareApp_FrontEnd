import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

type FormErrors = {
  hospitalName?: string;
  doctorName?: string;
  phoneNumber?: string;
};

const DoctorSignupScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [hospitalName, setHospitalName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const isFormValid = useMemo(() => {
    return (
      hospitalName.trim().length > 0 &&
      doctorName.trim().length > 0 &&
      phoneNumber.trim().length > 0
    );
  }, [hospitalName, doctorName, phoneNumber]);

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!hospitalName.trim()) {
      nextErrors.hospitalName = '병원명을 입력해주세요.';
    }

    if (!doctorName.trim()) {
      nextErrors.doctorName = '이름을 입력해주세요.';
    }

    if (!phoneNumber.trim()) {
      nextErrors.phoneNumber = '전화번호를 입력해주세요.(-없이 숫자만 입력)';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitted(true);

    if (!validateForm()) return;

    try {
      const payload = {
        hospitalName: hospitalName.trim(),
        doctorName: doctorName.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      // TODO:
      // 서버 연결 시 가입 요청 API 호출
      // await api.post("/doctor/signup-requests", payload);

      console.log('의사 회원가입 요청:', payload);

      Alert.alert(
        '요청 완료',
        '의사 회원가입 요청이 접수되었습니다. 승인 후 의사 모드를 사용할 수 있습니다.',
      );

      navigation.goBack();
    } catch (e) {
      Alert.alert('오류', '의사 회원가입 요청 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>의사 회원가입</Text>
          <Text style={styles.description}>
            병원과 의사 정보를 입력해주세요.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Text style={styles.label}>병원명</Text>
            <TextInput
              style={[
                styles.input,
                submitted && errors.hospitalName && styles.inputErrorBorder,
              ]}
              placeholder="병원명을 입력하세요"
              value={hospitalName}
              onChangeText={text => {
                setHospitalName(text);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    hospitalName: text.trim() ? '' : '병원명을 입력해주세요.',
                  }));
                }
              }}
            />
            {submitted && errors.hospitalName ? (
              <Text style={styles.errorText}>{errors.hospitalName}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              style={[
                styles.input,
                submitted && errors.doctorName && styles.inputErrorBorder,
              ]}
              placeholder="이름을 입력하세요"
              value={doctorName}
              onChangeText={text => {
                setDoctorName(text);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    doctorName: text.trim() ? '' : '이름을 입력해주세요.',
                  }));
                }
              }}
            />
            {submitted && errors.doctorName ? (
              <Text style={styles.errorText}>{errors.doctorName}</Text>
            ) : null}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>전화번호</Text>
            <TextInput
              style={[
                styles.input,
                submitted && errors.phoneNumber && styles.inputErrorBorder,
              ]}
              placeholder="01012345678 (-없이 숫자만 입력)"
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    phoneNumber: text.trim()
                      ? ''
                      : '전화번호를 입력해주세요.(-없이 숫자만 입력)',
                  }));
                }
              }}
              keyboardType="phone-pad"
            />
            {submitted && errors.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              !isFormValid && styles.submitButtonDisabled,
              pressed && isFormValid && styles.pressed,
            ]}
            disabled={!isFormValid}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>가입 요청하기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default DoctorSignupScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#EF4444',
  },
  submitButton: {
    marginTop: 4,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
