export type BasicOperator = 'in' | 'eq' | 'neq' | 'nin' | 'gt';
// in：包含, 选择了，任一
// eq: 等于，选择了，全部
// nin: 不包含，不选择，任一
// neq：不等于，不选择，全部，可以实现“填写了”
export type FieldTypes = string | string[];

// 定义事实对象类型
export type Fact = {
  [key: string]: any;
};