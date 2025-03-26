import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from '../../utils';
import { NPSRating } from '../../components';
import type { ControlProps } from '../../models';
import { useConfig } from '../../configprovider';

const styles = StyleSheet.create({
  npsDescWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  npsDesc: {
    fontSize: scale(20),
    color: '#92949D',
  },
});

export const SurveyNPS: React.FC<
  ControlProps & { formValue: Map<string, any> }
> = (props) => {
  const {
    field,
    onBtnChange,
    npsMax,
    nps: { leftText = '', rightText = '' },
    formValue,
  } = props;

  const [value, setValue] = useState(0);
  const { theme } = useConfig();

  useEffect(() => {
    if (formValue.has(field)) {
      const initValues = formValue.get(field);
      if (initValues) {
        setValue(initValues);
      }
    }
  }, [field, formValue]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.npsDescWrap}>
        <Text style={styles.npsDesc}>{leftText}</Text>
        <Text style={styles.npsDesc}>{rightText}</Text>
      </View>
      <NPSRating
        max={npsMax}
        selectColor={theme!.themeColor}
        containerStyle={{ margin: 10 }}
        value={value}
        onValueChange={(npsValue) => {
          setValue(npsValue);
          onBtnChange && onBtnChange({ field, value: npsValue });
        }}
      />
    </View>
  );
};

SurveyNPS.displayName = 'SurveyNPS';
