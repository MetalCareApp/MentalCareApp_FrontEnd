import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { RouteProp, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

type RootStackParamList = {
  report_detail: { reportId: number };
};

type ReportDetailRouteProp = RouteProp<RootStackParamList, 'report_detail'>;

type ReportDetail = {
  id: number;
  patientName: string;
  createdAt: string;
  sleepData: {
    date: string;
    sleepHours: number;
  }[];
  medicationData: {
    date: string;
    tookMedicine: boolean;
  }[];
  emotionData: {
    date: string;
    score: number; // 1~5
  }[];
  diarySummary: string;
};

const DUMMY_REPORT: ReportDetail = {
  id: 1,
  patientName: '홍길동',
  createdAt: '2026-04-28',
  sleepData: [
    { date: '2026-04-15', sleepHours: 6.5 },
    { date: '2026-04-16', sleepHours: 7 },
    { date: '2026-04-17', sleepHours: 5.5 },
    { date: '2026-04-18', sleepHours: 8 },
    { date: '2026-04-19', sleepHours: 6 },
    { date: '2026-04-20', sleepHours: 7.5 },
    { date: '2026-04-21', sleepHours: 7 },
    { date: '2026-04-22', sleepHours: 6 },
    { date: '2026-04-23', sleepHours: 6.8 },
    { date: '2026-04-24', sleepHours: 5 },
    { date: '2026-04-25', sleepHours: 7.2 },
    { date: '2026-04-26', sleepHours: 8 },
    { date: '2026-04-27', sleepHours: 6.5 },
    { date: '2026-04-28', sleepHours: 7 },
  ],
  medicationData: [
    { date: '2026-04-15', tookMedicine: true },
    { date: '2026-04-16', tookMedicine: true },
    { date: '2026-04-17', tookMedicine: false },
    { date: '2026-04-18', tookMedicine: true },
    { date: '2026-04-19', tookMedicine: true },
    { date: '2026-04-20', tookMedicine: false },
    { date: '2026-04-21', tookMedicine: true },
    { date: '2026-04-22', tookMedicine: true },
    { date: '2026-04-23', tookMedicine: true },
    { date: '2026-04-24', tookMedicine: false },
    { date: '2026-04-25', tookMedicine: true },
    { date: '2026-04-26', tookMedicine: true },
    { date: '2026-04-27', tookMedicine: false },
    { date: '2026-04-28', tookMedicine: true },
  ],
  emotionData: [
    { date: '2026-04-15', score: 3 },
    { date: '2026-04-16', score: 4 },
    { date: '2026-04-17', score: 2 },
    { date: '2026-04-18', score: 3 },
    { date: '2026-04-19', score: 4 },
    { date: '2026-04-20', score: 3 },
    { date: '2026-04-21', score: 5 },
    { date: '2026-04-22', score: 3 },
    { date: '2026-04-23', score: 4 },
    { date: '2026-04-24', score: 2 },
    { date: '2026-04-25', score: 3 },
    { date: '2026-04-26', score: 4 },
    { date: '2026-04-27', score: 3 },
    { date: '2026-04-28', score: 5 },
  ],
  diarySummary:
    '최근 일주일간 전반적인 감정 상태는 보통에서 긍정적인 방향으로 변화했습니다. 수면 시간이 부족했던 날에는 감정 점수가 낮아지는 경향이 있었고, 복약을 꾸준히 한 날에는 비교적 안정적인 하루를 보낸 것으로 나타났습니다.',
};

const screenWidth = Dimensions.get('window').width;
const cardHorizontalPadding = 32;
const pageHorizontalPadding = 40;

const visibleChartWidth =
  screenWidth - pageHorizontalPadding - cardHorizontalPadding;

const getChartWidth = (dataLength: number) => {
  const minBarSpace = 44;
  return Math.max(visibleChartWidth, dataLength * minBarSpace);
};

const ReportDetailScreen: React.FC = () => {
  const route = useRoute<ReportDetailRouteProp>();
  const { reportId } = route.params;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get(`/reports/${reportId}`);
        // setReport(response.data);

        setReport(DUMMY_REPORT);
      } catch (e) {
        setError('리포트를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const medicationRate = useMemo(() => {
    if (!report || report.medicationData.length === 0) return 0;

    const successCount = report.medicationData.filter(
      item => item.tookMedicine,
    ).length;

    return Math.round((successCount / report.medicationData.length) * 100);
  }, [report]);

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: () => '#2563EB',
    labelColor: () => '#6B7280',
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#2563EB',
    },
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>리포트를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>
          {error || '리포트 데이터를 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  const sleepChartData = {
    labels: report.sleepData.map((item, index) =>
      index % 2 === 0 ? dayjs(item.date).format('MM/DD') : '',
    ),
    datasets: [
      {
        data: report.sleepData.map(item => item.sleepHours),
      },
    ],
  };

  const emotionChartData = {
    labels: report.emotionData.map((item, index) =>
      index % 2 === 0 ? dayjs(item.date).format('MM/DD') : '',
    ),
    datasets: [
      {
        data: report.emotionData.map(item => item.score),
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>리포트</Text>
          <Text style={styles.headerText}>환자명: {report.patientName}</Text>
          <Text style={styles.headerText}>
            생성일: {dayjs(report.createdAt).format('YYYY.MM.DD')}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>수면 데이터</Text>
          <Text style={styles.sectionDescription}>일자별 수면 시간</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={sleepChartData}
              width={getChartWidth(report.sleepData.length)}
              height={240}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel=""
              yAxisSuffix="h"
              fromZero
              showValuesOnTopOfBars
            />
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>감정 변화</Text>
          <Text style={styles.sectionDescription}>
            1점 매우 나쁨 · 3점 보통 · 5점 매우 좋음
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={emotionChartData}
              width={getChartWidth(report.emotionData.length)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              fromZero
              segments={4}
            />
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>복약률</Text>

          <View style={styles.medicationBox}>
            <Text style={styles.medicationRate}>{medicationRate}%</Text>
            <Text style={styles.medicationDescription}>
              전체 {report.medicationData.length}일 중{' '}
              {report.medicationData.filter(item => item.tookMedicine).length}일
              복약 성공
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>감정일기 요약</Text>
          <Text style={styles.summaryText}>{report.diarySummary}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
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
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  chart: {
    borderRadius: 12,
  },
  medicationBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  medicationRate: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2563EB',
    marginBottom: 8,
  },
  medicationDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#111827',
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
});
