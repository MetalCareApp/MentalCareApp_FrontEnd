import React, { useMemo } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import AppColor from "../../utils/AppColor";
import { makeCalendarArray } from "../../utils/AppUtils";
import Day from "./Day";

interface CalendarProps {
  year: number;
  month: number;
  data: {
    [date: string]: { id: number };
  };
}

const Calendar = (props: CalendarProps) => {
  const { year, month, data } = props;
	const tempData = {
		"2026-03-01": {
			id: 1,
		},
		"2026-03-02": {
			id: 2,
		},
	}
  const calendarArray = useMemo(() => {
    return makeCalendarArray(year, month).map((d) => {
      if (d === null) return null;
      if (!tempData[d as keyof typeof tempData]) {
        return { [d]: {id: 0} };
      }
      return { [d]: tempData[d as keyof typeof tempData] };
    });
  }, [year, month, data]);

  return (
    <View style={styles.container}>
			<View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 6, marginBottom: 10 }}>	
				{["일", "월", "화", "수", "목", "금", "토"].map((d) => (
					<Text key={d} style={{ textAlign: "center", paddingHorizontal: 6, marginHorizontal: 4, fontWeight: "bold", fontSize: 14 }}>
						{d}
					</Text>
				))}
			</View>
			<FlatList
				data={calendarArray}
				renderItem={({ item }) => <Day date={item} color={AppColor.main} />}
				numColumns={7}
				horizontal={false}
				keyExtractor={(item, index) => index.toString()}
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

    shadowColor: "#000",
    shadowOffset: { width: 3, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },
});