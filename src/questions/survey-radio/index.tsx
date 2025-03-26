import React, { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { scale } from '../../utils';
import { RadioButton } from '../../components';
import type { ControlProps } from '../../models';
import { useConfig } from '../../configprovider';

export const SurveyRadio: React.FC<
  ControlProps & { formValue: Map<string, any> }
> = (props) => {
  const { field, isVertical, options = [], onBtnChange, formValue } = props;

  const [selectIdx, setSelectIdx] = useState(-1);
  const { theme } = useConfig();

  useEffect(() => {
    if (formValue.has(field)) {
      const initValue = formValue.get(field);
      if (initValue) {
        const idx = options.findIndex((item) => item.hash === initValue);
        setSelectIdx(idx);
      }
    }
  }, [field, formValue, options]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[{ flexDirection: isVertical ? 'column' : 'row' }]}>
        {options.map((v, i) => (
          <RadioButton
            key={i}
            style={{ marginBottom: i !== options.length - 1 ? scale(32) : 0 }}
            select={selectIdx === i}
            label={v.text}
            color="#C8C9CD"
            selectColor={theme!.themeColor}
            onPress={() => {
              setSelectIdx(i);
              const option = options[i];
              onBtnChange && onBtnChange({ field, value: option?.hash });
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

SurveyRadio.displayName = 'SurveyRadio';
