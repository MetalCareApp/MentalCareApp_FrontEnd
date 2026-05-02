import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

type Report = {
  id: number;
  date: string;
};

const DUMMY_REPORTS: Report[] = [
  {
    id: 306,
    date: '2026-04-28',
  },
  {
    id: 203,
    date: '2026-04-25',
  },
  {
    id: 102,
    date: '2026-04-20',
  },
];

const MyReportListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get("/reports");
        // setReports(response.data);

        setReports(DUMMY_REPORTS);
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

  const renderItem = ({ item, index }: { item: Report; index: number }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => handlePressReport(item.id)}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.numberBadge}>
            <Text style={styles.numberBadgeText}>리포트 ID {item.id}</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>

        <Text style={styles.reportTitle}>{item.date} 리포트</Text>

        <Text style={styles.reportDate}>
          생성일 {dayjs(item.date).format('YYYY.MM.DD')}
        </Text>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>리포트 목록을 불러오는 중입니다.</Text>
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
      <FlatList
        // data={sortedReports}
        data={reports}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>나의 리포트</Text>

            <Text style={styles.description}>
              생성된 리포트를 날짜별로 확인할 수 있습니다.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>아직 리포트가 없습니다</Text>

            <Text style={styles.emptyDescription}>
              리포트가 생성되면 이곳에서 볼 수 있습니다.
            </Text>
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
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#4338CA',
  },

  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
  },

  reportTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: '700',
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
    fontWeight: '700',
    color: '#111827',
  },

  emptyContainer: {
    paddingVertical: 60,
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
  },

  pressed: {
    opacity: 0.7,
  },
});
