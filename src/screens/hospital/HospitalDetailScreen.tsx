import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import HeartIcon from '../../assets/icon/HeartIcon';
import AppColor from '../../utils/AppColor';
import {
  getHospitalDetails,
  HospitalDetail,
  likeHospital,
  unlikeHospital,
} from '../../apis/hospitalApi';

type RootStackParamList = {
  hospital_detail: { hospitalId: number };
};

type HospitalDetailRouteProp = RouteProp<RootStackParamList, 'hospital_detail'>;

const HospitalDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<HospitalDetailRouteProp>();
  const { hospitalId } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [hospitalDetail, setHospitalDetail] = useState<HospitalDetail | null>(
    null,
  );
  const [error, setError] = useState<string>('');

  const formattedOpenedAt = useMemo(() => {
    if (!hospitalDetail?.openingDate) return '';
    return dayjs(hospitalDetail.openingDate).format('YYYY.MM.DD');
  }, [hospitalDetail]);

  useEffect(() => {
    const fetchHospitalDetail = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getHospitalDetails(hospitalId);

        if (!response) {
          setError('병원 정보를 찾을 수 없습니다.');
          setHospitalDetail(null);
          return;
        }

        setHospitalDetail(response);
      } catch (e) {
        setError('병원 정보를 불러오는 중 오류가 발생했습니다.');
        setHospitalDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetail();
  }, [hospitalId]);

  const handleRetry = async () => {
    setLoading(true);
    setError('');

    const response = await getHospitalDetails(hospitalId);

    if (!response) {
      setError('병원 정보를 찾을 수 없습니다.');
      setHospitalDetail(null);
      setLoading(false);
      return;
    }

    setHospitalDetail(response);
    setLoading(false);
  };

  const handleToggleFavorite = async () => {
    if (!hospitalDetail) return;
    await likeHospital(hospitalId);
    setHospitalDetail(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        liked: true,
      };
    });
  };

  const handleToggleUnFavorite = async () => {
    if (!hospitalDetail) return;
    await unlikeHospital(hospitalId);
    setHospitalDetail(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        liked: false,
      };
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>병원 정보를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !hospitalDetail) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>
          {error || '병원 정보를 찾을 수 없습니다.'}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.headerTitle}>{hospitalDetail.name}</Text>
              <Text style={styles.headerDistrict}>
                {hospitalDetail.address.split(' ')[0]}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={
                hospitalDetail.liked
                  ? handleToggleUnFavorite
                  : handleToggleFavorite
              }
            >
              <HeartIcon
                color={
                  hospitalDetail.liked
                    ? AppColor.main
                    : AppColor.background.gray
                }
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>기본 정보</Text>

          <InfoItem label="병원명" value={hospitalDetail.name} />
          <InfoItem label="주소" value={hospitalDetail.address} />
          <InfoItem label="개업일자" value={formattedOpenedAt} />
          <InfoItem label="전화번호" value={hospitalDetail.phone} isLast />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>의료진 정보</Text>

          <InfoItem
            label="전문의 수"
            value={`${hospitalDetail.specialistCount}명`}
          />
          <InfoItem
            label="일반의 수"
            value={`${hospitalDetail.generalDoctorCount}명`}
            isLast
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.primaryButtonText}>뒤로가기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

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

export default HospitalDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
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
  retryButton: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  header: {
    marginBottom: 18,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextWrapper: {
    flex: 1,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerDistrict: {
    fontSize: 14,
    color: '#6B7280',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  primaryButton: {
    marginTop: 6,
    backgroundColor: AppColor.main,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: AppColor.white,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
