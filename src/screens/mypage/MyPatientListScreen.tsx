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

type Patient = {
  id: number;
  name: string;
  email: string;
  registeredAt: string;
};

const DUMMY_PATIENTS: Patient[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    registeredAt: '2026-04-12',
  },
  {
    id: 2,
    name: '김민수',
    email: 'minsu@example.com',
    registeredAt: '2026-04-18',
  },
  {
    id: 3,
    name: '이지은',
    email: 'jieun@example.com',
    registeredAt: '2026-04-25',
  },
];

const PatientListScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get("/doctor/patients");
        // setPatients(response.data);

        setPatients(DUMMY_PATIENTS);
      } catch (e) {
        setError('환자 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const sortedPatients = useMemo(() => {
    return [...patients].sort(
      (a, b) =>
        dayjs(b.registeredAt).valueOf() - dayjs(a.registeredAt).valueOf(),
    );
  }, [patients]);

  const handlePressPatient = (patientId: number) => {
    navigation.navigate('patient_detail', { patientId });
  };

  const renderItem = ({ item }: { item: Patient }) => {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => handlePressPatient(item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientEmail}>{item.email}</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </View>

        <View style={styles.registeredBox}>
          <Text style={styles.infoLabel}>등록일</Text>
          <Text style={styles.infoValue}>
            {dayjs(item.registeredAt).format('YYYY.MM.DD')}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>환자 목록을 불러오는 중입니다.</Text>
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
        data={sortedPatients}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>나의 환자 목록</Text>
            <Text style={styles.description}>
              등록된 환자 정보를 확인할 수 있습니다.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>등록된 환자가 없습니다</Text>
            <Text style={styles.emptyDescription}>
              환자가 등록되면 이곳에서 확인할 수 있습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default PatientListScreen;

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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  patientEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  arrow: {
    fontSize: 22,
    color: '#9CA3AF',
  },
  registeredBox: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
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
  pressed: {
    opacity: 0.7,
  },
});
