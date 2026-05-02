import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';

type RootStackParamList = {
  patient_detail: { patientId: number };
  report_detail: { reportId: number };
};

type PatientDetailRouteProp = RouteProp<RootStackParamList, 'patient_detail'>;

type Patient = {
  id: number;
  name: string;
  email: string;
  registeredAt: string;
};

type Report = {
  id: number;
  date: string;
};

const DUMMY_PATIENT: Patient = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  registeredAt: '2026-04-12',
};

const DUMMY_REPORTS: Report[] = [
  {
    id: 1,
    date: '2026-04-28',
  },
  {
    id: 2,
    date: '2026-04-25',
  },
  {
    id: 3,
    date: '2026-04-20',
  },
];

const PatientDetailScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<PatientDetailRouteProp>();
  const { patientId } = route.params;

  const [loading, setLoading] = useState<boolean>(true);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string>('');

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const [showStartDatePicker, setShowStartDatePicker] =
    useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);

  const sortedReports = useMemo(() => {
    return [...reports].sort(
      (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
    );
  }, [reports]);

  useEffect(() => {
    const fetchPatientDetail = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const patientResponse = await api.get(`/doctor/patients/${patientId}`);
        // const reportResponse = await api.get(`/doctor/patients/${patientId}/reports`);
        // setPatient(patientResponse.data);
        // setReports(reportResponse.data);

        setPatient(DUMMY_PATIENT);
        setReports(DUMMY_REPORTS);
      } catch (e) {
        setError('환자 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetail();
  }, [patientId]);

  const handlePressReport = (reportId: number) => {
    navigation.navigate('report_detail', { reportId });
  };

  const handleOpenCreateReportModal = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const handleChangeStartDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }

    if (event.type === 'dismissed') return;

    if (selectedDate) {
      setStartDate(selectedDate);

      if (dayjs(selectedDate).isAfter(endDate, 'day')) {
        setEndDate(selectedDate);
      }
    }
  };

  const handleChangeEndDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }

    if (event.type === 'dismissed') return;

    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleCreateReport = async () => {
    if (dayjs(startDate).isAfter(endDate, 'day')) {
      Alert.alert('날짜 오류', '시작일자는 종료일자보다 늦을 수 없습니다.');
      return;
    }

    try {
      const payload = {
        patientId,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
      };

      // TODO:
      // 서버 연결 시 교체
      // const response = await api.post(`/doctor/patients/${patientId}/reports`, payload);
      // setReports((prev) => [response.data, ...prev]);

      console.log('리포트 생성 요청:', payload);

      const newReport: Report = {
        id: Date.now(),
        date: dayjs().format('YYYY-MM-DD'),
      };

      setReports(prev => [newReport, ...prev]);

      Alert.alert('생성 완료', '리포트 생성 요청이 완료되었습니다.');
      handleCloseModal();
    } catch (e) {
      Alert.alert('오류', '리포트 생성 요청 중 문제가 발생했습니다.');
    }
  };

  const renderReportItem = ({
    item,
    index,
  }: {
    item: Report;
    index: number;
  }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.reportCard, pressed && styles.pressed]}
        onPress={() => handlePressReport(item.id)}
      >
        <View style={styles.reportTopRow}>
          <View style={styles.reportBadge}>
            <Text style={styles.reportBadgeText}>리포트 {index + 1}</Text>
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
        <Text style={styles.helperText}>환자 정보를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !patient) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>불러오지 못했습니다</Text>
        <Text style={styles.helperText}>
          {error || '환자 정보를 찾을 수 없습니다.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={sortedReports}
        keyExtractor={item => item.id.toString()}
        renderItem={renderReportItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => [
                styles.createReportButton,
                pressed && styles.pressed,
              ]}
              onPress={handleOpenCreateReportModal}
            >
              <Text style={styles.createReportButtonText}>리포트 생성</Text>
            </Pressable>

            <View style={styles.patientCard}>
              <Text style={styles.patientName}>{patient.name}</Text>
              <Text style={styles.patientEmail}>{patient.email}</Text>
              <Text style={styles.patientRegisteredAt}>
                등록일 {dayjs(patient.registeredAt).format('YYYY.MM.DD')}
              </Text>
            </View>

            <View style={styles.reportHeader}>
              <Text style={styles.sectionTitle}>리포트 목록</Text>
              <Text style={styles.sectionDescription}>
                최신순으로 정렬된 환자 리포트입니다.
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>아직 리포트가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              리포트를 생성하면 이곳에서 확인할 수 있습니다.
            </Text>
          </View>
        }
      />

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalDim}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>리포트 생성</Text>
            <Text style={styles.modalDescription}>
              리포트에 포함할 기간을 선택해주세요.
            </Text>

            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>시작일자</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.dateButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setShowStartDatePicker(prev => !prev);
                  setShowEndDatePicker(false);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {dayjs(startDate).format('YYYY-MM-DD')}
                </Text>
              </Pressable>

              {showStartDatePicker && (
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleChangeStartDate}
                  />
                </View>
              )}
            </View>

            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>종료일자</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.dateButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setShowEndDatePicker(prev => !prev);
                  setShowStartDatePicker(false);
                }}
              >
                <Text style={styles.dateButtonText}>
                  {dayjs(endDate).format('YYYY-MM-DD')}
                </Text>
              </Pressable>

              {showEndDatePicker && (
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleChangeEndDate}
                  />
                </View>
              )}
            </View>

            <View style={styles.modalButtonRow}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleCloseModal}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleCreateReport}
              >
                <Text style={styles.submitButtonText}>생성</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PatientDetailScreen;

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
  createReportButton: {
    alignSelf: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 999,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginBottom: 20,
  },
  createReportButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  patientName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  patientEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  patientRegisteredAt: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  reportHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  reportTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  reportBadgeText: {
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
  modalDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    marginBottom: 20,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  dateButtonText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  datePickerWrapper: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 6,
  },
  cancelButtonText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
  },
  pressed: {
    opacity: 0.7,
  },
});
