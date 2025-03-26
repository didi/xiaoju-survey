import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CardRender } from '../render/card-render';

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#fff',
  },
});

export const SurveyCard: React.FC = (props: any) => {
  const { containerStyle, ...extraProps } = props;
  return (
    <View style={[styles.cardContainer, containerStyle]}>
      <CardRender container="card" {...extraProps} />
    </View>
  );
};
