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
import {
  cancelMatch,
  getMatchByMatchId,
  MyHospital,
} from '../../apis/matchApi';
import { useUserStore } from '../../stores/user';
import CustomText from '../../components/common/CustomText';

const MyHospitalManageScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hospital, setHospital] = useState<MyHospital | null>(null);
  const [error, setError] = useState<string>('');

  const { matchId } = useUserStore();

  useEffect(() => {
    const fetchMyHospital = async () => {
      try {
        if (matchId) {
          setLoading(true);
          setError('');
          const response = await getMatchByMatchId(matchId);
          setHospital(response);
        } else {
          setHospital(null);
        }
      } catch (e) {
        setError('나의 병원 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyHospital();
  }, [matchId]);

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
            if (matchId) {
              await cancelMatch(matchId);
              setHospital(null);
              console.log('병원 연결 해제:', matchId);
              Alert.alert('완료', '병원 연결이 해제되었습니다.');
            } else {
              Alert.alert(
                '오류',
                '매칭 번호를 알 수 없습니다. 잠시 후 다시 시도해주세요.',
              );
            }
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
        <CustomText style={styles.helperText}>
          나의 병원 정보를 불러오는 중입니다.
        </CustomText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <CustomText weight="700" style={styles.errorTitle}>
          불러오지 못했습니다
        </CustomText>
        <CustomText style={styles.helperText}>{error}</CustomText>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <CustomText weight="700" style={styles.title}>
            나의 병원 관리
          </CustomText>
          <CustomText style={styles.description}>
            연결된 병원 정보를 확인하고 관리할 수 있습니다.
          </CustomText>
        </View>

        {hospital ? (
          <>
            <View style={styles.card}>
              <CustomText weight="700" style={styles.sectionTitle}>
                연결된 병원
              </CustomText>

              <InfoItem label="의사명" value={hospital.doctorName} />
              <InfoItem label="병원명" value={hospital.hospitalName} />
              <InfoItem label="주소" value={hospital.address} />
              <InfoItem label="전화번호" value={hospital.phone} />
              <InfoItem
                label="개업일자"
                value={dayjs(hospital.openingAt).format('YYYY.MM.DD')}
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
              <CustomText weight="700" style={styles.disconnectButtonText}>
                병원 연결 끊기
              </CustomText>
            </Pressable>
          </>
        ) : (
          <View style={styles.emptyCard}>
            <CustomText weight="700" style={styles.emptyTitle}>
              연결된 병원이 없습니다
            </CustomText>
            <CustomText style={styles.emptyDescription}>
              아직 내 계정과 연결된 병원이 없습니다.
            </CustomText>
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
      <CustomText style={styles.infoLabel}>{label}</CustomText>
      <CustomText weight="600" style={styles.infoValue}>
        {value}
      </CustomText>
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '600',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
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
    // fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  pressed: {
    opacity: 0.7,
  },
});
