import { Pressable, StyleSheet, Text, View } from 'react-native';
import CustomText from '../common/CustomText';

interface MonthCarouselProps {
  selectedDate: {
    year: number;
    month: number;
  };
  onClick: (direction: 'prev' | 'next') => () => void;
}

function MonthCarousel(props: MonthCarouselProps) {
  const { selectedDate, onClick } = props;
  return (
    <View style={styles.container}>
      <Pressable onPress={onClick('prev')}>
        <CustomText style={styles.carouselButton}>{'〈'}</CustomText>
      </Pressable>
      <View
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <CustomText weight="700" style={styles.text}>
          {selectedDate.year + '년'}
        </CustomText>
        <CustomText
          weight="700"
          style={[styles.text, { width: 46, textAlign: 'right' }]}
        >
          {selectedDate.month + '월'}
        </CustomText>
      </View>
      <Pressable onPress={onClick('next')}>
        <CustomText weight="700" style={styles.carouselButton}>
          {'〉'}
        </CustomText>
      </Pressable>
    </View>
  );
}

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
    // fontWeight: 'bold',
  },
  carouselButton: {
    // fontWeight: 'bold',
    fontSize: 20,
  },
});
