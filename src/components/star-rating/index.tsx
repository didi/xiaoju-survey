import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { scale } from '../../utils';
import { Icon } from '../icon';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    lineHeight: scale(30),
    marginLeft: scale(10),
    fontSize: scale(28),
  },
});

export interface StarRatingProps {
  max: number;
  color: string;
  selectColor: string;
  value: number;
  disable?: boolean;
  starSize?: number;
  containerStyle?: ViewStyle;
  onValueChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = (props) => {
  const {
    max = 5,
    starSize = scale(48),
    onValueChange,
    containerStyle = {},
    color,
    selectColor = props.color,
    disable,
    value,
  } = props;
  const handleRating = (val: number) => {
    if (val === value) {
      onValueChange && onValueChange(0);
    } else {
      onValueChange && onValueChange(val);
    }
  };
  return (
    <View style={[styles.wrap, containerStyle]}>
      {Array.from({ length: max }, (_, i) => i).map((_, index) => (
        <Pressable
          key={index}
          onPress={() => !disable && handleRating(index + 1)}
        >
          <Icon
            color={disable ? '#d9d9d9' : index >= value ? color : selectColor}
            size={starSize}
            name={index >= value ? 'star_unselect' : 'star_select'}
          />
        </Pressable>
      ))}
    </View>
  );
};

StarRating.displayName = 'StarRating';
