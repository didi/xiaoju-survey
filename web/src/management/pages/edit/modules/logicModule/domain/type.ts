// type comparatorEnmu = 'and' | 'or'
// type operatorEnmu = 'equal' | 'notequal'

// interface BasicCondition {
//   id: string;
//   type: 'basic';
//   field: string;
//   operator: string;
//   value: string | number | boolean | string[] | number[] | boolean[];
// }

// interface ComposeCondition {
//   id: string;
//   type: 'compose';
//   comparator: comparatorEnmu;
//   children: Condition[];
// }
// type Condition = BasicCondition | ComposeCondition;

// type ActionObject= {
//   field: string,
//   children: Array<ActionObject>
// }

// type scopeEnmu = 'question' | 'subTitle' | 'option'
// type Rule = {
//   id: string
//   condition: Condition[]
//   scope: scopeEnmu,
//   actions: ActionObject
// }