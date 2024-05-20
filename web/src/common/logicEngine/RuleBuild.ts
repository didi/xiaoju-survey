import { nanoid } from 'nanoid';
import * as yup from 'yup'
import { type FieldTypes, PrefixID, Operator, Scope } from './BasicType'

export function generateID(prefix = PrefixID.Rule) {
  return `${prefix}-${nanoid(5)}`
}
// 定义条件规则类
export class ConditionNode {
  id: string = '';
  public field: string = '';
  public operator: Operator = Operator.Include; 
  public value: FieldTypes = []
  constructor(field: string = '', operator: Operator = Operator.Include, value: FieldTypes = []) {
    this.field = field;
    this.operator = operator;
    this.value = value;
    this.id = generateID(PrefixID.Condition)
  }
  setField(field: string) {
    this.field = field;
  }
  setOperator(operator: Operator) {
    this.operator = operator;
  }
  setValue(value: FieldTypes) {
    this.value = value;
  }
}

export class RuleNode {
  id: string = '';
  conditions: ConditionNode[] = []
  scope: string = Scope.Question
  target: string = ''
  constructor(scope:string = Scope.Question, target: string = '') {
    this.id = generateID(PrefixID.Rule)
    this.scope = scope
    this.target = target
  }
  setTarget(value: string) {
    this.target = value
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
  static instance: RuleBuild;
  constructor() {
    this.rules = [];
    if (!RuleBuild.instance) {
      RuleBuild.instance = this;
    }
    
    return RuleBuild.instance;
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
    this.rules = []
    if(ruleConf instanceof Array) {
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
    }
    return this
  }
  validateSchema() {
    return ruleSchema.validateSync(this.toJson())
  }
  // 实现目标选择了下拉框置灰效果
  findTargetsByScope(scope: string){
    return this.rules.filter(rule => rule.scope === scope).map(rule => rule.target)
  }
  // 实现前置题删除校验
  findTargetsByFields(field: string) {
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
  // 根据目标题获取显示逻辑
  findConditionByTarget(target: string) {
    return this.rules.filter(rule=> rule.target === target).map(item => item.conditions)
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
        value: yup.array().of(yup.string().required())
      })
    )
  })
)