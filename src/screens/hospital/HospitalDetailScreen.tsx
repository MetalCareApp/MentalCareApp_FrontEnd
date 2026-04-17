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

type RootStackParamList = {
  hospital_detail: { hospitalId: number };
};

type HospitalDetailRouteProp = RouteProp<RootStackParamList, 'hospital_detail'>;

type HospitalDetail = {
  id: number;
  name: string;
  address: string;
  district: string;
  openedAt: string;
  phoneNumber: string;
  specialistCount: number;
  generalDoctorCount: number;
  isFavorite: boolean;
};

const DUMMY_HOSPITAL_DETAIL_DATA: HospitalDetail[] = [
  {
    id: 1,
    name: '서울마음정신건강의학과의원',
    address: '서울특별시 강남구 테헤란로 123',
    district: '강남구',
    openedAt: '2018-03-12',
    phoneNumber: '02-1234-5678',
    specialistCount: 3,
    generalDoctorCount: 1,
    isFavorite: false,
  },
  {
    id: 2,
    name: '연세편안정신건강의학과의원',
    address: '서울특별시 송파구 올림픽로 88',
    district: '송파구',
    openedAt: '2020-07-01',
    phoneNumber: '02-2222-1111',
    specialistCount: 2,
    generalDoctorCount: 0,
    isFavorite: true,
  },
  {
    id: 3,
    name: '한빛정신건강의학과의원',
    address: '서울특별시 마포구 월드컵북로 45',
    district: '마포구',
    openedAt: '2016-11-21',
    phoneNumber: '02-9876-5432',
    specialistCount: 1,
    generalDoctorCount: 2,
    isFavorite: false,
  },
];

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
    if (!hospitalDetail?.openedAt) return '';
    return dayjs(hospitalDetail.openedAt).format('YYYY.MM.DD');
  }, [hospitalDetail]);

  useEffect(() => {
    const fetchHospitalDetail = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 추후 서버 연동 시 이 부분에서 hospitalId를 사용해 상세 API 요청
        // 예시:
        // const response = await api.get(`/hospitals/${hospitalId}`);
        // setHospitalDetail(response.data);

        const foundHospital = DUMMY_HOSPITAL_DETAIL_DATA.find(
          item => item.id === hospitalId,
        );

        if (!foundHospital) {
          setError('병원 정보를 찾을 수 없습니다.');
          setHospitalDetail(null);
          return;
        }

        setHospitalDetail(foundHospital);
      } catch (e) {
        setError('병원 정보를 불러오는 중 오류가 발생했습니다.');
        setHospitalDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalDetail();
  }, [hospitalId]);

  const handleRetry = () => {
    setLoading(true);
    setError('');

    const foundHospital = DUMMY_HOSPITAL_DETAIL_DATA.find(
      item => item.id === hospitalId,
    );

    if (!foundHospital) {
      setError('병원 정보를 찾을 수 없습니다.');
      setHospitalDetail(null);
      setLoading(false);
      return;
    }

    setHospitalDetail(foundHospital);
    setLoading(false);
  };

  const handleToggleFavorite = () => {
    if (!hospitalDetail) return;

    setHospitalDetail(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isFavorite: !prev.isFavorite,
      };
    });

    // TODO:
    // 추후 서버 연동 시 즐겨찾기 저장/해제 API 호출
    // 예시:
    // await api.post(`/hospitals/${hospitalId}/favorite`);
    // 또는
    // await api.delete(`/hospitals/${hospitalId}/favorite`);
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
                {hospitalDetail.district}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [pressed && styles.pressed]}
              onPress={handleToggleFavorite}
            >
              <HeartIcon
                color={
                  hospitalDetail.isFavorite
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
          <InfoItem
            label="전화번호"
            value={hospitalDetail.phoneNumber}
            isLast
          />
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
