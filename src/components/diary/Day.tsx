import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import AppColor from "../../utils/AppColor";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface DayProps {
  date: {
    [date: string]: { id: number };
  } | null;
  color: string;
}

export default function Day(props: DayProps) {
	const navigation = useNavigation();

  const { date, color } = props;

  const extractedDate = useMemo(() => {
    if (date === null) return "";
    return dayjs(Object.keys(date)[0]).get("date");
  }, [date]);

	const onClick = useCallback(() => {
		if (date === null) return;
		const id = date[Object.keys(date)[0]].id;
		if (id === 0) return;
		
		//@ts-ignore
		navigation.navigate("diary_detail", { diaryId: id });
		return;
	}, [date]);

  return (
    <Pressable
			onPress={onClick}
			style={[
				styles.container,
				{ 
					backgroundColor: date === null ? AppColor.white : date[Object.keys(date)[0]].id !== 0 ? color : AppColor.background.lightgray
				}
			]}
		>
        <Text style={styles.text}>{extractedDate}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: '50%',
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
		padding: 6,
		margin: 4,
	},
	text: {
		fontSize: 12,
    fontWeight: 'bold',
	}
});
