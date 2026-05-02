import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type PatientSearchResult = {
  id: number;
  name: string;
  email: string;
  isRequested: boolean;
};

const DUMMY_PATIENTS: PatientSearchResult[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    isRequested: false,
  },
  {
    id: 2,
    name: '김민수',
    email: 'minsu@example.com',
    isRequested: false,
  },
  {
    id: 3,
    name: '이지은',
    email: 'jieun@example.com',
    isRequested: true,
  },
  {
    id: 4,
    name: '박서준',
    email: 'seojoon@test.com',
    isRequested: false,
  },
];

const PatientRegisterScreen: React.FC = () => {
  const [emailKeyword, setEmailKeyword] = useState<string>('');
  const [patients, setPatients] = useState<PatientSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const canSearch = useMemo(() => {
    return emailKeyword.trim().length > 0 && !loading;
  }, [emailKeyword, loading]);

  const handleSearch = async () => {
    if (!canSearch) return;

    try {
      setLoading(true);
      setSearched(true);

      // TODO:
      // 서버 연결 시 교체
      // const response = await api.get("/doctor/patients/search", {
      //   params: { email: emailKeyword.trim() },
      // });
      // setPatients(response.data);

      const result = DUMMY_PATIENTS.filter(patient =>
        patient.email.toLowerCase().includes(emailKeyword.trim().toLowerCase()),
      );

      setPatients(result);
    } catch (e) {
      Alert.alert('오류', '환자 검색 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestRegister = async (patientId: number) => {
    try {
      // TODO:
      // 서버 연결 시 교체
      // await api.post(`/doctor/patients/${patientId}/request`);

      console.log('환자 등록 요청:', patientId);

      setPatients(prev =>
        prev.map(patient =>
          patient.id === patientId
            ? { ...patient, isRequested: true }
            : patient,
        ),
      );

      Alert.alert('요청 완료', '환자에게 등록 요청을 보냈습니다.');
    } catch (e) {
      Alert.alert('오류', '등록 요청 중 문제가 발생했습니다.');
    }
  };

  const renderItem = ({ item }: { item: PatientSearchResult }) => {
    return (
      <View style={styles.patientCard}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientEmail}>{item.email}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.requestButton,
            item.isRequested && styles.requestButtonDisabled,
            pressed && !item.isRequested && styles.pressed,
          ]}
          disabled={item.isRequested}
          onPress={() => handleRequestRegister(item.id)}
        >
          <Text
            style={[
              styles.requestButtonText,
              item.isRequested && styles.requestButtonDisabledText,
            ]}
          >
            {item.isRequested ? '요청됨' : '등록 요청'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={patients}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>환자 등록</Text>
            <Text style={styles.description}>
              환자의 이메일을 검색한 뒤 등록 요청을 보낼 수 있습니다.
            </Text>

            <View style={styles.searchBox}>
              <Text style={styles.label}>환자 이메일</Text>

              <View style={styles.searchRow}>
                <TextInput
                  style={styles.input}
                  placeholder="이메일을 입력하세요"
                  value={emailKeyword}
                  onChangeText={setEmailKeyword}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="search"
                  onSubmitEditing={handleSearch}
                />

                <Pressable
                  style={({ pressed }) => [
                    styles.searchButton,
                    !canSearch && styles.searchButtonDisabled,
                    pressed && canSearch && styles.pressed,
                  ]}
                  disabled={!canSearch}
                  onPress={handleSearch}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.searchButtonText}>검색</Text>
                  )}
                </Pressable>
              </View>
            </View>

            {searched && (
              <Text style={styles.resultCount}>
                검색 결과 {patients.length}명
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          searched && !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>검색 결과가 없습니다</Text>
              <Text style={styles.emptyDescription}>
                이메일을 다시 확인해주세요.
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>환자를 검색해주세요</Text>
              <Text style={styles.emptyDescription}>
                이메일을 입력하면 환자 목록이 표시됩니다.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default PatientRegisterScreen;

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
    marginBottom: 20,
  },
  searchBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 68,
  },
  searchButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resultCount: {
    marginTop: 14,
    fontSize: 13,
    color: '#6B7280',
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
    marginRight: 12,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  patientEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  requestButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  requestButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  requestButtonDisabledText: {
    color: '#6B7280',
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
