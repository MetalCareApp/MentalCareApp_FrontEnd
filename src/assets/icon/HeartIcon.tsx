import { SvgXml } from 'react-native-svg';
import SVGPropsType from '../../types/SVGPropsType';
import AppColor from '../../utils/AppColor';

function HeartIcon({
  width = 24,
  height = 24,
  color = AppColor.main,
}: SVGPropsType) {
  return (
    <SvgXml
      xml={`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
          <path fill=${color} d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917Z"/>
        </svg>
      `}
      width={width}
      height={height}
    />
  );
}

export default HeartIcon;
