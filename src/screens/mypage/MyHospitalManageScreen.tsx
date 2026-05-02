import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';

type MyHospital = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  openedAt: string;
};

const DUMMY_MY_HOSPITAL: MyHospital | null = {
  id: 1,
  name: '서울마음정신건강의학과의원',
  address: '서울특별시 강남구 테헤란로 123',
  phoneNumber: '02-1234-5678',
  openedAt: '2018-03-12',
};

// 병원이 없는 상태 테스트하려면 위 대신 이걸 사용
// const DUMMY_MY_HOSPITAL: MyHospital | null = null;

const MyHospitalManageScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hospital, setHospital] = useState<MyHospital | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMyHospital = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get("/doctor/my-hospital");
        // setHospital(response.data);

        setHospital(DUMMY_MY_HOSPITAL);
      } catch (e) {
        setError('나의 병원 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyHospital();
  }, []);

  const handleDisconnectHospital = () => {
    if (!hospital) return;

    Alert.alert('병원 연결 끊기', '정말 이 병원과의 연결을 끊으시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '연결 끊기',
        style: 'destructive',
        onPress: async () => {
          try {
            // TODO:
            // 서버 연결 시 교체
            // await api.delete(`/doctor/my-hospital/${hospital.id}`);

            console.log('병원 연결 해제:', hospital.id);
            setHospital(null);

            Alert.alert('완료', '병원 연결이 해제되었습니다.');
          } catch (e) {
            Alert.alert('오류', '병원 연결 해제 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>
          나의 병원 정보를 불러오는 중입니다.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>나의 병원 관리</Text>
          <Text style={styles.description}>
            연결된 병원 정보를 확인하고 관리할 수 있습니다.
          </Text>
        </View>

        {hospital ? (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>연결된 병원</Text>

              <InfoItem label="병원명" value={hospital.name} />
              <InfoItem label="주소" value={hospital.address} />
              <InfoItem label="전화번호" value={hospital.phoneNumber} />
              <InfoItem
                label="개업일자"
                value={dayjs(hospital.openedAt).format('YYYY.MM.DD')}
                isLast
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.disconnectButton,
                pressed && styles.pressed,
              ]}
              onPress={handleDisconnectHospital}
            >
              <Text style={styles.disconnectButtonText}>병원 연결 끊기</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>연결된 병원이 없습니다</Text>
            <Text style={styles.emptyDescription}>
              아직 내 계정과 연결된 병원이 없습니다.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MyHospitalManageScreen;

type InfoItemProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

const InfoItem: React.FC<InfoItemProps> = ({
  label,
  value,
  isLast = false,
}) => {
  return (
    <View style={[styles.infoItem, isLast && styles.infoItemLast]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
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
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoItemLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 22,
  },
  disconnectButton: {
    marginTop: 18,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  disconnectButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
