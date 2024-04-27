import { nanoid } from 'nanoid';
import { type BasicOperator, type FieldTypes } from './BasicType'

export function generateID(prefix = 'r') {
  return `${prefix}-${nanoid(5)}`
}
// 定义条件规则类
export class ConditionNode {
  id: string = '';
  public field: string = '';
  public operator: BasicOperator = 'in'; 
  public value: FieldTypes = ''
  constructor() {
    this.id = generateID('c')
  }
  setField(field: string) {
    this.field = field;
  }
  setOperator(operator: BasicOperator) {
    this.operator = operator;
  }
  setValue(value: FieldTypes) {
    this.value = value;
  }
}

export class RuleNode {
  id: string = '';
  conditions: ConditionNode[] = []
  scope: string = 'question'
  target: string = ''
  constructor() {
    this.id = generateID('r')
  }
  addCondition(condition: ConditionNode) {
    this.conditions.push(condition);
  }
  findCondition(conditionId: string) {
    return this.conditions.find(condition => condition.id === conditionId);
  }
}

export class RulesBuild {
  rules: RuleNode[] = [];
  constructor(ruleConf: any) {
    this.rules = [];
  }

  // 添加条件规则到规则引擎中
  addRule(rule: RuleNode) {
    this.rules.push(rule);
  }
  findRule(ruleId: string) {
    return this.rules.find(rule => rule.id === ruleId);
  }
  toJson() {
    return this.rules.map(rule => {
      return {
        target: rule.target,
        scope: rule.scope,
        conditions: rule.conditions.map(condition => {
          return {
            field: condition.field,
            operator: condition.operator,
            value: condition.value
          }
        })
      }
    })
  }
}
