import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import HospitalCard from '../../components/HospitalCard';
import { useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  getFavoriteHospitals,
  Hospital,
  likeHospital,
  unlikeHospital,
} from '../../apis/hospitalApi';
import CustomText from '../../components/common/CustomText';

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

        const response = await getFavoriteHospitals();
        setHospitalList(response);
      } catch (e) {
        setError('병원 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalList();
  }, []);

  const filteredHospitalList = useMemo(() => {
    return hospitalList.filter(hospital => {
      const matchesKeyword = hospital.name
        .toLowerCase()
        .includes(searchKeyword.trim().toLowerCase());

      return matchesKeyword;
    });
  }, [hospitalList, searchKeyword]);

  const handleToggleFavorite = (hospitalId: number) => async () => {
    await likeHospital(hospitalId);
    setHospitalList(prev =>
      prev.map(hospital =>
        hospital.id === hospitalId ? { ...hospital, liked: true } : hospital,
      ),
    );
  };

  const handleToggleUnFavorite = (hospitalId: number) => async () => {
    await unlikeHospital(hospitalId);
    setHospitalList(prev =>
      prev.map(hospital =>
        hospital.id === hospitalId ? { ...hospital, liked: false } : hospital,
      ),
    );
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
        handleToggleUnFavorite={handleToggleUnFavorite(item.id)}
      />
    );
  };

  return (
    <View>
      <FlatList
        data={filteredHospitalList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderHospitalItem}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <CustomText weight="700" style={styles.title}>
              병원 목록
            </CustomText>

            <View style={styles.searchSection}>
              <CustomText weight="600" style={styles.label}>
                병원명 검색
              </CustomText>
              <TextInput
                style={styles.searchInput}
                placeholder="병원명을 입력하세요"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
              />
            </View>

            <CustomText style={styles.resultCount}>
              총 {hospitalList.length}개의 병원
            </CustomText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomText weight="700" style={styles.emptyTitle}>
              찜한 병원이 없습니다
            </CustomText>
            <CustomText style={styles.emptyDescription}>
              마음에 드는 병원을 찜해보세요.
            </CustomText>
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
    // fontWeight: '700',
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
    // fontWeight: '600',
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
    fontFamily: 'SUITE-SemiBold',
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
    // fontWeight: '700',
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
