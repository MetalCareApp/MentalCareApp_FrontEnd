import { Pressable, StyleSheet, View } from 'react-native';
import DateCarousel from '../../components/diary/DateCarousel';
import { useState } from 'react';
import Calendar from '../../components/diary/Calendar';
import { useNavigation } from '@react-navigation/native';
import AppColor from '../../utils/AppColor';
import PencilIcon from '../../assets/icon/PencilIcon';

function DiaryCalendarScreen() {
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  const onClickCarousel = (direction: 'prev' | 'next') => () => {
    if (direction === 'prev') {
      if (selectedDate.month === 1) {
        setSelectedDate(prev => ({
          year: prev.year - 1,
          month: 12,
        }));
      } else {
        setSelectedDate(prev => ({
          ...prev,
          month: prev.month - 1,
        }));
      }
    } else {
      if (selectedDate.month === 12) {
        setSelectedDate(prev => ({
          year: prev.year + 1,
          month: 1,
        }));
      } else {
        setSelectedDate(prev => ({
          ...prev,
          month: prev.month + 1,
        }));
      }
    }
  };

  return (
    <View style={styles.container}>
      <DateCarousel
        selectedDate={{ year: selectedDate.year, month: selectedDate.month }}
        onClick={onClickCarousel}
      />
      <Calendar data={{}} year={selectedDate.year} month={selectedDate.month} />
      <Pressable
        style={styles.writeButton}
        onPress={() => navigation.navigate('diary_create' as never)}
      >
        <PencilIcon color={AppColor.white} width={30} height={30} />
      </Pressable>
    </View>
  );
}

export default DiaryCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  writeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: AppColor.main,
    padding: 10,
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    width: 64,
  },
});
