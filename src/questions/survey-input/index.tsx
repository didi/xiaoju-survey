import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { scale } from '../../utils';
import type { ControlProps } from '../../models';

const styles = StyleSheet.create({
  textArea: {
    borderWidth: scale(1),
    borderColor: '#E3E4E8',
    minHeight: scale(200),
    maxHeight: scale(250),
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    textAlignVertical: 'top',
  },
});

export const SurveyInput: React.FC<
  ControlProps & { formValue: Map<string, any> }
> = (props) => {
  const { field, onBtnChange, placeholder = '', formValue } = props;

  const [text, setText] = useState('');

  useEffect(() => {
    if (formValue.has(field)) {
      const initValues = formValue.get(field);
      if (initValues) {
        setText(initValues);
      }
    }
  }, [field, formValue]);

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        multiline
        value={text}
        style={styles.textArea}
        placeholder={` ${placeholder}`}
        onChangeText={(inputText) => {
          setText(inputText);
          onBtnChange && onBtnChange({ field, value: inputText });
        }}
      />
    </View>
  );
};

SurveyInput.displayName = 'SurveyInput';
