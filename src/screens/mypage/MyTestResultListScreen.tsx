import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';

type TestResult = {
  id: number;
  testType: string;
  testedAt: string;
  score: number;
  result: string;
};

const DUMMY_TEST_RESULTS: TestResult[] = [
  {
    id: 1,
    testType: '우울 척도 검사',
    testedAt: '2026-04-28',
    score: 12,
    result: '경도 우울',
  },
  {
    id: 2,
    testType: '불안 척도 검사',
    testedAt: '2026-04-22',
    score: 8,
    result: '정상 범위',
  },
  {
    id: 3,
    testType: '불안 척도 검사',
    testedAt: '2026-04-15',
    score: 25,
    result: '중등도 불안',
  },
];

const MyTestResultListScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get("/test-results");
        // setTestResults(response.data);

        setTestResults(DUMMY_TEST_RESULTS);
      } catch (e) {
        setError('테스트 결과 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  const sortedTestResults = useMemo(() => {
    return [...testResults].sort(
      (a, b) => dayjs(b.testedAt).valueOf() - dayjs(a.testedAt).valueOf(),
    );
  }, [testResults]);

  const renderItem = ({ item }: { item: TestResult }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.testType}>{item.testType}</Text>
          {/* <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{item.score}점</Text>
          </View> */}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>테스트 일자</Text>
          <Text style={styles.infoValue}>
            {dayjs(item.testedAt).format('YYYY.MM.DD')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>테스트 점수</Text>
          <Text style={styles.infoValue}>{item.score}점</Text>
        </View>

        <View style={[styles.infoRow, styles.lastInfoRow]}>
          <Text style={styles.infoLabel}>테스트 결과</Text>
          <Text style={styles.resultText}>{item.result}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>테스트 결과를 불러오는 중입니다.</Text>
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
        data={sortedTestResults}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>테스트 결과</Text>
            <Text style={styles.description}>
              진행한 심리 테스트 결과를 한눈에 확인할 수 있습니다.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>아직 테스트 결과가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              심리 테스트를 완료하면 이곳에서 결과를 확인할 수 있습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default MyTestResultListScreen;

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
    lineHeight: 21,
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
    marginBottom: 14,
  },
  testType: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  scoreBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  scoreBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338CA',
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  resultText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
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
    textAlign: 'center',
    lineHeight: 21,
  },
});
