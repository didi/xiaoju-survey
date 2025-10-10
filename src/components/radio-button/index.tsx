import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { scale } from '../../utils';
import { Icon } from '../icon';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    lineHeight: scale(34),
    marginLeft: scale(10),
    fontSize: scale(28),
  },
});

export interface RadioButtonProps {
  select: boolean;
  label: string;
  color: string;
  selectColor: string;
  disable?: boolean;
  iconSize?: number;
  textStyle?: any;
  style?: any;
  onPress: (select: boolean) => void;
}

export const RadioButton: React.FC<RadioButtonProps> = (props) => {
  const {
    onPress,
    select,
    iconSize = scale(42),
    color,
    selectColor = props.color,
    label,
    disable,
    textStyle = {},
    style = {},
  } = props;
  return (
    <Pressable
      style={[styles.wrap, style]}
      onPress={() => !disable && onPress(select)}
    >
      <Icon
        name={select ? 'radio_select' : 'radio_unselect'}
        size={iconSize}
        color={disable ? '#d9d9d9' : select ? selectColor : color}
      />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </Pressable>
  );
};

RadioButton.displayName = 'RadioButton';
