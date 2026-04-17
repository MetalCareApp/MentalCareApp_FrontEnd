import { Pressable, StyleSheet, Text, View } from 'react-native';
import HeartIcon from '../assets/icon/HeartIcon';
import AppColor from '../utils/AppColor';
import dayjs from 'dayjs';
import Hospital from '../types/Hospital';

function HospitalCard({
  item,
  handlePressHospital,
  handleToggleFavorite,
}: {
  item: Hospital;
  handlePressHospital: (hospitalId: number) => void;
  handleToggleFavorite: (hospitalId: number) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => handlePressHospital(item.id)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.hospitalName}>{item.name}</Text>

        <Pressable
          style={({ pressed }) => [pressed && styles.pressed]}
          onPress={() => handleToggleFavorite(item.id)}
        >
          <HeartIcon
            color={item.isFavorite ? AppColor.main : AppColor.background.gray}
          />
        </Pressable>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>주소</Text>
        <Text style={styles.infoValue}>{item.address}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>개업일자</Text>
        <Text style={styles.infoValue}>
          {dayjs(item.openedAt).format('YYYY.MM.DD')}
        </Text>
      </View>

      <View style={styles.badgeWrapper}>
        <View style={styles.districtBadge}>
          <Text style={styles.districtBadgeText}>{item.district}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 12,
  },
  hospitalName: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginRight: 12,
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
  favoriteIconActive: {
    color: '#EF4444',
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  badgeWrapper: {
    marginTop: 6,
    flexDirection: 'row',
  },
  districtBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  districtBadgeText: {
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default HospitalCard;
