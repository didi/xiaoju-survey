import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import type { ViewStyle } from 'react-native';
import { scale } from '../../utils';

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
  ratingBox: {
    backgroundColor: '#E3E4E8',
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(50),
    height: scale(70),
  },
  rate: {
    fontWeight: 'bold',
    fontSize: scale(32),
    color: '#fff',
  },
});

export interface NPSRatingProps {
  max: number;
  selectColor: string;
  value: number;
  disable?: boolean;
  containerStyle?: ViewStyle;
  boxStyle?: ViewStyle;
  selectBoxStyle?: ViewStyle;
  onValueChange?: (rating: number) => void;
}

export const NPSRating: React.FC<NPSRatingProps> = (props) => {
  const {
    max = 5,
    onValueChange,
    containerStyle = {},
    boxStyle,
    selectBoxStyle,
    selectColor,
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
      {Array.from({ length: max }, (_, i) => i).map((star, index) => (
        <Pressable
          key={index}
          onPress={() => !disable && handleRating(index + 1)}
        >
          <View
            style={[
              styles.ratingBox,
              index >= value
                ? boxStyle || {}
                : selectBoxStyle || { backgroundColor: selectColor },
            ]}
          >
            <Text style={styles.rate}>{index + 1}</Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

NPSRating.displayName = 'NPSRating';
