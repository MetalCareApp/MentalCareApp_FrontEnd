import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import HospitalCard from '../../components/HospitalCard';
import Hospital from '../../types/Hospital';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const DUMMY_HOSPITALS: Hospital[] = [
  {
    id: 1,
    name: '서울마음정신건강의학과의원',
    address: '서울특별시 강남구 테헤란로 123',
    district: '강남구',
    openedAt: '2018-03-12',
    isFavorite: true,
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
    isFavorite: true,
  },
  {
    id: 4,
    name: '우리동네정신건강의학과의원',
    address: '서울특별시 강남구 봉은사로 210',
    district: '강남구',
    openedAt: '2022-01-17',
    isFavorite: true,
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

const FavoriteHospitalsScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [hospitalList, setHospitalList] = useState<Hospital[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
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

  return (
    <View>
      <FlatList
        data={hospitalList}
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

            <Text style={styles.resultCount}>
              총 {hospitalList.length}개의 병원
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>찜한 병원이 없습니다</Text>
            <Text style={styles.emptyDescription}>
              마음에 드는 병원을 찜해보세요.
            </Text>
          </View>
        }
      />
    </View>
  );
};

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
});

export default FavoriteHospitalsScreen;
