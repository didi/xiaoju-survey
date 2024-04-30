import { nanoid } from 'nanoid';
import * as yup from 'yup'
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
  constructor(field: string = '', operator: BasicOperator = 'in', value: FieldTypes = '') {
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.id = generateID('c')
  }
  // @ts-ignore
  set(key, value) {
    // @ts-ignore
    this[key] = value
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
  constructor(scope:string = 'question', target: string = '') {
    this.id = generateID('r')
    this.scope = scope
    this.target = target
  }
  // @ts-ignore
  set(key, value) {
    // @ts-ignore
    this[key] = value
  }
  addCondition(condition: ConditionNode) {
    this.conditions.push(condition);
  }
  removeCondition(id: string) {
    this.conditions = this.conditions.filter(v => v.id !== id);
  }
  findCondition(conditionId: string) {
    return this.conditions.find(condition => condition.id === conditionId);
  }
}

export class RuleBuild {
  rules: RuleNode[] = [];
  constructor() {
    this.rules = [];
  }

  // 添加条件规则到规则引擎中
  addRule(rule: RuleNode) {
    this.rules.push(rule);
  }
  removeRule(ruleId: string) {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
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
  fromJson(ruleConf: any) {
    ruleConf.forEach((rule: any) => {
      const { scope, target } = rule
      const ruleNode = new RuleNode(scope, target);
      rule.conditions.forEach((condition: any) => {
        const { field, operator, value } = condition
        const conditionNode = new ConditionNode(field, operator, value);
        ruleNode.addCondition(conditionNode)
      })
      this.addRule(ruleNode)
    })
    return this
  }
  validateSchema() {
    return ruleSchema.validateSync(this.toJson())
  }
  findTargetsByScope(scope: string){
    return this.rules.filter(rule => rule.scope === scope).map(rule => rule.target)
  }
  findTargetsByFields(field: string) {
    // @ts-ignore
    const nodes = this.rules.filter((rule: RuleNode) => {
      const conditions =  rule.conditions.filter((item: any) => {
        return item.field === field
      })
      return conditions.length > 0  
    })
    return nodes.map((item: any) => {
      return item.target
    })
  }
}


export const ruleSchema = yup.array().of(
  yup.object({
    target: yup.string().required(),
    scope: yup.string().required(),
    conditions: yup.array().of(
      yup.object({
        field: yup.string().required(),
        operator: yup.string().required(),
        value: yup.string().required()
      })
    )
  })
)