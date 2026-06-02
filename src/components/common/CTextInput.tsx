import { ReactElement } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import AppColor from '../../utils/AppColor';
import CustomText from './CustomText';

interface CTextInputProps {
  wrapperStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  endAdornment?: ReactElement;
  error?: boolean;
  helperText?: string;
  helperTextStyle?: TextStyle;
  notErrorHelperText?: string;
}

export default function CTextInput({
  wrapperStyle,
  containerStyle,
  endAdornment,
  helperText,
  helperTextStyle,
  error,
  notErrorHelperText,
  ...rest
}: CTextInputProps & TextInputProps) {
  return (
    <View style={[styles.wrapper, wrapperStyle]}>
      <View style={[styles.container, containerStyle]}>
        <TextInput {...rest} style={[{ flex: 1 }, rest.style]} />
        {endAdornment && endAdornment}
      </View>
      {error && helperText && (
        <CustomText style={[styles.helperText, helperTextStyle]}>
          {helperText}
        </CustomText>
      )}
      {notErrorHelperText && (
        <CustomText
          style={[styles.helperText, { color: AppColor.text.success }]}
        >
          {notErrorHelperText}
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AppColor.border.lightgray,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 6,
  },
  helperText: {
    color: AppColor.text.error,
    fontSize: 12,
    marginBottom: 2,
    position: 'absolute',
    top: 46,
  },
});
