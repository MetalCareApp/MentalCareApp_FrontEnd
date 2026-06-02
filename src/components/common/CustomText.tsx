import React from 'react';
import { Text, TextProps } from 'react-native';

const CustomText: React.FC<
  TextProps & { weight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' }
> = props => {
  const { style, weight = 400 } = props;

  const fontFamily = {
    100: 'SUITE-Light',
    200: 'SUITE-Regular',
    300: 'SUITE-Medium',
    400: 'SUITE-SemiBold',
    500: 'SUITE-Bold',
    600: 'SUITE-ExtraBold',
    700: 'SUITE-Heavy',
  }[weight];
  // const fontFamily = {
  //   100: 'HumanBeomseokNeo-Thin',
  //   200: 'HumanBeomseokNeo-ExtraLight',
  //   300: 'HumanBeomseokNeo-Light',
  //   400: 'HumanBeomseokNeo-Regular',
  //   500: 'HumanBeomseokNeo-Medium',
  //   600: 'HumanBeomseokNeo-SemiBold',
  //   700: 'HumanBeomseokNeo-Bold',
  // }[weight];

  return <Text {...props} style={[{ fontFamily }, style]} />;
};

export default CustomText;
