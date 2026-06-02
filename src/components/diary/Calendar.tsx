import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppColor from '../../utils/AppColor';
import { makeCalendarArray } from '../../utils/AppUtils';
import Day from './Day';

type EmotionType = 'GREAT' | 'GOOD' | 'NORMAL' | 'BAD' | 'VERY_BAD';

export type DiaryData = {
  id: number;
  content: string;
  createdAt: string;
  diaryDate: string;
  emotion: EmotionType;
  emotionScore: 1 | 2 | 3 | 4 | 5;
  medicationReaction: string;
  medicationTaken: boolean;
  sleepEndTime: string;
  sleepStartTime: string;
  title: string;
  totalSleepMinutes: number;
  updatedAt: string;
};

type CalendarDayData = null | {
  [date: string]: { id: number };
};

interface CalendarProps {
  year: number;
  month: number;
  data: DiaryData[];
}

const Calendar = ({ year, month, data }: CalendarProps) => {
  const diaryMap = useMemo(() => {
    return data.reduce<Record<string, DiaryData>>((acc, diary) => {
      acc[diary.diaryDate] = diary;
      return acc;
    }, {});
  }, [data]);

  const calendarArray = useMemo<CalendarDayData[]>(() => {
    return makeCalendarArray(year, month).map(date => {
      if (date === null) return null;

      const diary = diaryMap[date];

      return {
        [date]: {
          id: diary?.id ?? 0,
        },
      };
    });
  }, [year, month, diaryMap]);

  return (
    <View style={styles.container}>
      <View style={styles.weekHeader}>
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <Text key={day} style={styles.weekText}>
            {day}
          </Text>
        ))}
      </View>

      <FlatList
        data={calendarArray}
        renderItem={({ item }) => <Day date={item} color={AppColor.main} />}
        numColumns={7}
        scrollEnabled={false}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColor.white,
    borderRadius: 12,
    padding: 14,
    margin: 20,

    shadowColor: '#000',
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  weekText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
