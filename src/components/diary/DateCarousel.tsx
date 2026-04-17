import { Pressable, StyleSheet, Text, View } from "react-native";

interface MonthCarouselProps {
  selectedDate: {
    year: number;
    month: number;
  };
  onClick: (direction: "prev" | "next") => () => void;
}

function MonthCarousel(props: MonthCarouselProps){
  const { selectedDate, onClick } = props;
  return (
    <View style={styles.container}>
      <Pressable onPress={onClick("prev")}>
        <Text style={styles.carouselButton}>{"〈"}</Text>
      </Pressable>
      <View style={{ display: "flex", flexDirection: 'row', alignItems: "center" }}>
        <Text style={styles.text}>{selectedDate.year + "년"}</Text>
        <Text style={[styles.text, { width: 46, textAlign: "right" }]}>
          {selectedDate.month + "월"}
        </Text>
      </View>
      <Pressable onPress={onClick("next")}>
        <Text style={styles.carouselButton}>{"〉"}</Text>
      </Pressable>
    </View>
  );
};

export default MonthCarousel;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    columnGap: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  carouselButton: {
    fontWeight: 'bold',
    fontSize: 20,
  }
});
