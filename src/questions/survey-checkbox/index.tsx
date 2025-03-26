import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { scale } from '../../utils';
import { CheckBoxButton } from '../../components';
import type { ControlProps } from '../../models';
import { useConfig } from '../../configprovider';

export const SurveyCheckBox: React.FC<
  ControlProps & { formValue: Map<string, any> }
> = (props) => {
  const { field, isVertical, options = [], onBtnChange, formValue } = props;

  const [selectIdxs, setSelectIdxs] = useState<number[]>([]);
  const { theme } = useConfig();

  useEffect(() => {
    if (formValue.has(field)) {
      const initValues = formValue.get(field);
      if (initValues && initValues.length > 0) {
        const selects: number[] = [];
        initValues.forEach((id: string) => {
          const idx = options.findIndex((opt) => opt.hash === id);
          if (idx >= 0) {
            selects.push(idx);
          }
        });
        setSelectIdxs(selects);
      }
    }
  }, [field, formValue, options]);

  const onValueChange = (ids: number[]) => {
    const value = ids.map((idx) => {
      const item = options[idx];
      return item?.hash;
    });
    onBtnChange &&
      onBtnChange({
        field,
        value,
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[{ flexDirection: isVertical ? 'column' : 'row' }]}>
        {options.map((v, i) => (
          <CheckBoxButton
            key={i}
            style={{ marginBottom: i !== options.length - 1 ? scale(32) : 0 }}
            select={selectIdxs.includes(i)}
            label={v.text}
            color="#C8C9CD"
            selectColor={theme!.themeColor}
            onPress={() => {
              let newIdxs: number[] = [];
              if (selectIdxs.includes(i)) {
                newIdxs = selectIdxs.filter((item) => item !== i);
              } else {
                newIdxs = [...selectIdxs, i];
              }
              setSelectIdxs(newIdxs);
              onValueChange(newIdxs);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

SurveyCheckBox.displayName = 'SurveyCheckBox';
