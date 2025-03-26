import React from 'react';
import { Image, Pressable, View } from 'react-native';
import type { ImageSourcePropType, ViewStyle } from 'react-native';
import { images } from './images';
import { isValidUrl, scale } from '../../utils';

export const getImageSource = (key: string) => {
  return images[key] as ImageSourcePropType;
};

export interface IconProps {
  name: string;
  size: number;
  color?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Icon: React.FC<IconProps> = (props) => {
  const {
    name,
    size = scale(30),
    color = '#92949D',
    style = {},
    onPress,
  } = props;

  const isImageUrl = name ? isValidUrl(name) : false;

  const imageEle = (
    <Image
      source={isImageUrl ? { uri: name } : getImageSource(`${name}`)}
      style={{
        width: size,
        height: size,
        tintColor: color,
      }}
      resizeMode={'contain'}
    />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[{ width: size, height: size }, style]}
      >
        {imageEle}
      </Pressable>
    );
  }
  return <View style={[{ width: size, height: size }, style]}>{imageEle}</View>;
};
Icon.displayName = 'Icon';
