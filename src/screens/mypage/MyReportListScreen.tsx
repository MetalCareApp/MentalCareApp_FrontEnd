import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import CustomText from '../../components/common/CustomText';
import { AIReport, getMyReports } from '../../apis/reportApi';

// type Report = {
//   id: number;
//   createdAt: string;
// };

// const DUMMY_REPORTS: Report[] = [
//   {
//     id: 572,
//     createdAt: '2026-04-28',
//   },
//   {
//     id: 203,
//     createdAt: '2026-04-25',
//   },
//   {
//     id: 102,
//     createdAt: '2026-04-20',
//   },
// ];

const MyReportListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<AIReport[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getMyReports();
        setReports(response);
      } catch (e) {
        setError('리포트 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  //   const sortedReports = useMemo(() => {
  //     return [...reports].sort(
  //       (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
  //     );
  //   }, [reports]);

  const handlePressReport = (reportId: number) => {
    navigation.navigate('report_detail', { reportId });
  };

  const renderItem = ({ item, index }: { item: AIReport; index: number }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => handlePressReport(item.id)}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.numberBadge}>
            <CustomText weight="700" style={styles.numberBadgeText}>
              리포트 ID {item.id}
            </CustomText>
          </View>

          <CustomText style={styles.arrow}>›</CustomText>
        </View>

        <CustomText weight="700" style={styles.reportTitle}>
          {dayjs(item.createdAt).format('YYYY-MM-DD')} 리포트
        </CustomText>

        <CustomText style={styles.reportDate}>
          생성일 {dayjs(item.createdAt).format('YYYY.MM.DD')}
        </CustomText>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <CustomText style={styles.helperText}>
          리포트 목록을 불러오는 중입니다.
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
      <FlatList
        // data={sortedReports}
        data={reports}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <CustomText weight="700" style={styles.title}>
              나의 리포트
            </CustomText>

            <CustomText style={styles.description}>
              생성된 리포트를 날짜별로 확인할 수 있습니다.
            </CustomText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <CustomText weight="700" style={styles.emptyTitle}>
              아직 리포트가 없습니다
            </CustomText>

            <CustomText style={styles.emptyDescription}>
              리포트가 생성되면 이곳에서 볼 수 있습니다.
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default MyReportListScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  listContent: {
    padding: 20,
    paddingBottom: 40,
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
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  numberBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  numberBadgeText: {
    fontSize: 12,
    // fontWeight: '700',
    color: '#4338CA',
  },

  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
  },

  reportTitle: {
    marginTop: 14,
    fontSize: 18,
    // fontWeight: '700',
    color: '#111827',
  },

  reportDate: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  helperText: {
    marginTop: 12,
    color: '#6B7280',
  },

  errorTitle: {
    fontSize: 20,
    // fontWeight: '700',
    color: '#111827',
  },

  emptyContainer: {
    paddingVertical: 60,
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
  },

  pressed: {
    opacity: 0.7,
  },
});
