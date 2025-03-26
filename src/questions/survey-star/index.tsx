import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StarRating } from '../../components';
import type { ControlProps } from '../../models';
import { useConfig } from '../../configprovider';

export const SurveyStar: React.FC<
  ControlProps & { formValue: Map<string, any> }
> = (props) => {
  const { field, onBtnChange, starMax, formValue } = props;

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
      <StarRating
        max={starMax}
        color="#C8C9CD"
        selectColor={theme!.themeColor}
        containerStyle={{ margin: 10 }}
        value={value}
        onValueChange={(starValue) => {
          setValue(starValue);
          onBtnChange && onBtnChange({ field, value: starValue });
        }}
      />
    </View>
  );
};

SurveyStar.displayName = 'SurveyStar';
