import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import dayjs from 'dayjs';

type HospitalRequest = {
  id: number;
  hospitalName: string;
  doctorName: string;
  requestedAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};

const DUMMY_REQUESTS: HospitalRequest[] = [
  {
    id: 1,
    hospitalName: '서울마음정신건강의학과의원',
    doctorName: '김민준',
    requestedAt: '2026-04-28T14:30:00',
    status: 'PENDING',
  },
  {
    id: 2,
    hospitalName: '연세편안정신건강의학과의원',
    doctorName: '이서연',
    requestedAt: '2026-04-27T10:15:00',
    status: 'PENDING',
  },
];

function NotificationScreen() {
  const [loading, setLoading] = useState<boolean>(true);
  const [requests, setRequests] = useState<HospitalRequest[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError('');

        // TODO:
        // 서버 연결 시 교체
        // const response = await api.get("/notifications/hospital-requests");
        // setRequests(response.data);

        setRequests(DUMMY_REQUESTS);
      } catch (e) {
        setError('알림 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      // TODO:
      // 서버 연결 시 교체
      // await api.post(`/hospital-requests/${requestId}/accept`);

      setRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'ACCEPTED' }
            : request,
        ),
      );

      Alert.alert('수락 완료', '환자 등록 요청을 수락했습니다.');
    } catch (e) {
      Alert.alert('오류', '요청 수락 중 문제가 발생했습니다.');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      // TODO:
      // 서버 연결 시 교체
      // await api.post(`/hospital-requests/${requestId}/reject`);

      setRequests(prev =>
        prev.map(request =>
          request.id === requestId
            ? { ...request, status: 'REJECTED' }
            : request,
        ),
      );

      Alert.alert('거절 완료', '환자 등록 요청을 거절했습니다.');
    } catch (e) {
      Alert.alert('오류', '요청 거절 중 문제가 발생했습니다.');
    }
  };

  const renderItem = ({ item }: { item: HospitalRequest }) => {
    const isPending = item.status === 'PENDING';

    return (
      <View style={styles.card}>
        <View style={styles.infoArea}>
          <Text style={styles.hospitalName}>{item.hospitalName}</Text>

          <Text style={styles.doctorName}>{item.doctorName} 선생님</Text>

          <Text style={styles.requestedAt}>
            요청일시 {dayjs(item.requestedAt).format('YYYY.MM.DD HH:mm')}
          </Text>
        </View>

        {isPending ? (
          <View style={styles.buttonArea}>
            <Pressable
              style={({ pressed }) => [
                styles.acceptButton,
                pressed && styles.pressed,
              ]}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.acceptButtonText}>수락</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.rejectButton,
                pressed && styles.pressed,
              ]}
              onPress={() => handleReject(item.id)}
            >
              <Text style={styles.rejectButtonText}>거절</Text>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.statusBadge,
              item.status === 'ACCEPTED'
                ? styles.acceptedBadge
                : styles.rejectedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.status === 'ACCEPTED'
                  ? styles.acceptedText
                  : styles.rejectedText,
              ]}
            >
              {item.status === 'ACCEPTED' ? '수락됨' : '거절됨'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.helperText}>알림을 불러오는 중입니다.</Text>
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
        data={requests}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>알림</Text>
            <Text style={styles.description}>
              병원에서 보낸 환자 등록 요청을 확인할 수 있습니다.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>알림이 없습니다</Text>
            <Text style={styles.emptyDescription}>
              새로운 환자 등록 요청이 오면 이곳에 표시됩니다.
            </Text>
          </View>
        }
      />
    </View>
  );
}

export default NotificationScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    paddingTop: 40,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoArea: {
    flex: 1,
    marginRight: 12,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  doctorName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
  },
  requestedAt: {
    fontSize: 13,
    color: '#6B7280',
  },
  buttonArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  rejectButtonText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  acceptedBadge: {
    backgroundColor: '#DCFCE7',
  },
  rejectedBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
  },
  acceptedText: {
    color: '#16A34A',
  },
  rejectedText: {
    color: '#DC2626',
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
