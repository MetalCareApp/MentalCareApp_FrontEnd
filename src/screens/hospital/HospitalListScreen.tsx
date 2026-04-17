import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import HeartIcon from '../../assets/icon/HeartIcon';
import AppColor from '../../utils/AppColor';
import Hospital from '../../types/Hospital';
import HospitalCard from '../../components/HospitalCard';

type RootStackParamList = {
  hospital_detail: { hospitalId: number };
};

const DUMMY_HOSPITALS: Hospital[] = [
  {
    id: 1,
    name: '서울마음정신건강의학과의원',
    address: '서울특별시 강남구 테헤란로 123',
    district: '강남구',
    openedAt: '2018-03-12',
    isFavorite: false,
  },
  {
    id: 2,
    name: '연세편안정신건강의학과의원',
    address: '서울특별시 송파구 올림픽로 88',
    district: '송파구',
    openedAt: '2020-07-01',
    isFavorite: true,
  },
  {
    id: 3,
    name: '한빛정신건강의학과의원',
    address: '서울특별시 마포구 월드컵북로 45',
    district: '마포구',
    openedAt: '2016-11-21',
    isFavorite: false,
  },
  {
    id: 4,
    name: '우리동네정신건강의학과의원',
    address: '서울특별시 강남구 봉은사로 210',
    district: '강남구',
    openedAt: '2022-01-17',
    isFavorite: false,
  },
  {
    id: 5,
    name: '늘봄의원',
    address: '서울특별시 서초구 서초대로 302',
    district: '서초구',
    openedAt: '2019-09-03',
    isFavorite: true,
  },
];

const HospitalListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('전체');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHospitalList = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 추후 서버 연동 시 이 부분에서 병원 목록 API 호출
        // 예시:
        // const response = await api.get("/hospitals");
        // setHospitalList(response.data);

        setHospitalList(DUMMY_HOSPITALS);
      } catch (e) {
        setError('병원 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalList();
  }, []);

  const districtOptions = useMemo(() => {
    const districts = Array.from(
      new Set(hospitalList.map(item => item.district)),
    );
    return ['전체', ...districts];
  }, [hospitalList]);

  const filteredHospitalList = useMemo(() => {
    return hospitalList.filter(hospital => {
      const matchesKeyword = hospital.name
        .toLowerCase()
        .includes(searchKeyword.trim().toLowerCase());

      const matchesDistrict =
        selectedDistrict === '전체' || hospital.district === selectedDistrict;

      return matchesKeyword && matchesDistrict;
    });
  }, [hospitalList, searchKeyword, selectedDistrict]);

  const handleToggleFavorite = (hospitalId: number) => () => {
    setHospitalList(prev =>
      prev.map(hospital =>
        hospital.id === hospitalId
          ? { ...hospital, isFavorite: !hospital.isFavorite }
          : hospital,
      ),
    );

    // TODO:
    // 추후 서버 연동 시 즐겨찾기 저장/해제 API 호출
    // 예시:
    // await api.post(`/hospitals/${hospitalId}/favorite`);
    // 또는
    // await api.delete(`/hospitals/${hospitalId}/favorite`);
  };

  const handlePressHospital = (hospitalId: number) => () => {
    navigation.navigate('hospital_detail', { hospitalId });
  };

  const renderHospitalItem = ({ item }: { item: Hospital }) => {
    return (
      <HospitalCard
        item={item}
        handlePressHospital={handlePressHospital(item.id)}
        handleToggleFavorite={handleToggleFavorite(item.id)}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>병원 목록을 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>{error}</Text>

        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => {
            setLoading(true);
            setError('');
            setHospitalList(DUMMY_HOSPITALS);
            setLoading(false);
          }}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={filteredHospitalList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderHospitalItem}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>병원 목록</Text>

            <View style={styles.searchSection}>
              <Text style={styles.label}>병원명 검색</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="병원명을 입력하세요"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
              />
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.label}>지역 선택</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedDistrict}
                  onValueChange={(itemValue: string) =>
                    setSelectedDistrict(itemValue)
                  }
                >
                  {districtOptions.map(district => (
                    <Picker.Item
                      key={district}
                      label={district}
                      value={district}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <Text style={styles.resultCount}>
              총 {filteredHospitalList.length}개의 병원
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              검색어 또는 지역 조건을 바꿔보세요.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HospitalListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  listContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  searchSection: {
    marginBottom: 14,
  },
  filterSection: {
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultCount: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  hospitalName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  favoriteIconActive: {
    color: '#EF4444',
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  badgeWrapper: {
    marginTop: 6,
    flexDirection: 'row',
  },
  districtBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  districtBadgeText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '600',
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
  emptyContainer: {
    paddingVertical: 48,
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
  },
  pressed: {
    opacity: 0.7,
  },
});
