import * as Yup from 'yup';

// 定义每个题目的 schema
const questionSchema = Yup.object().shape({
  field: Yup.string().required('Field is required'),
  title: Yup.string().required('Title is required'),
  type: Yup.string().required('Type is required'),
});

// 自定义方法来校验字段是否存在于 dataList 中
Yup.addMethod(Yup.mixed, 'isFieldInDataList', function () {
  return this.test('is-field-in-dataList', '逻辑配置关联的题目不存在', function (value, context) {
    const from = context.options.from;
    const { dataConf } = from[from.length-1].value
    
    if (!dataConf || !dataConf.dataList) {
      return false;
    }

    const fieldList = dataConf.dataList.map((q) => q.field);
    if (Array.isArray(value)) {
      return value.every(v => fieldList.includes(v));
    }
    return fieldList.includes(value);
  });
});

// 定义整个问卷的 schema
export const surveySchema = Yup.object().shape({
  dataConf: Yup.object().shape({
    dataList: Yup.array().of(questionSchema).required('DataList is required'),
  }),
  logicConf: Yup.object().shape({
    jumpLogicConf: Yup.array().of(
      Yup.object().shape({
        target: Yup.mixed().required('Target field is required').isFieldInDataList(),  // 使用抽离的校验方法,
        conditions: Yup.array().of(
          Yup.object().shape({
            field: Yup.mixed().required('Condition field is required').isFieldInDataList(),  // 使用抽离的校验方法,
            operator: Yup.string().required('Operator is required'),
            value: Yup.string().required('Condition value is required'),
          })
        ).required('Conditions are required'),
      })
    ),
    showLogicConf:  Yup.array().of(
      Yup.object().shape({
        target: Yup.mixed().required('Target field is required').isFieldInDataList(),
        conditions: Yup.array().of(
          Yup.object().shape({
            field: Yup.mixed().required('Condition field is required').isFieldInDataList(),
            operator: Yup.string().required('Operator is required'),
            value: Yup.mixed().test('is-string-or-array', 'Field must be a string or array', value => 
              typeof value === 'string' || Array.isArray(value)
            ).required('Condition value is required'),
          })
        ).required('Conditions are required'),
      })
    ),
  }),
});