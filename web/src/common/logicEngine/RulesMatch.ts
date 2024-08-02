import { Operator, type FieldTypes, type Fact } from './BasicType'

// 定义条件规则类
export class ConditionNode<F extends string, O extends Operator> {
  // 默认显示
  public result: boolean | undefined = undefined
  constructor(
    public field: F,
    public operator: O,
    public value: FieldTypes
  ) {}

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.field + this.operator + this.value
  }

  match(facts: Fact): boolean {
    // console.log(this.calculateHash())
    // 如果该特征在事实对象中不存在，则直接返回false
    // facts = facts.value ?  facts.value : facts
    if (!facts[this.field]) {
      this.result = false
      return this.result
    }
    switch (this.operator) {
      case Operator.Equal:
        if (this.value instanceof Array) {
          this.result = this.value.every((v) => facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value)
          return this.result
        }
      case Operator.Include:
        if (this.value instanceof Array) {
          this.result = this.value.some((v) => facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value)
          return this.result
        }
      case Operator.NotInclude:
        if (this.value instanceof Array) {
          this.result = this.value.some((v) => !facts[this.field].includes(v))
          return this.result
        } else {
          this.result = !facts[this.field].includes(this.value)
          return this.result
        }
      case Operator.NotEqual:
        if (this.value instanceof Array) {
          this.result = this.value.every((v) => !facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].toString() !== this.value
          return this.result
        }
      // 其他比较操作符的判断逻辑
      default:
        return this.result
    }
  }

  getResult() {
    return this.result
  }
}

export class RuleNode {
  conditions: Map<string, ConditionNode<string, Operator>> // 使用哈希表存储条件规则对象
  public result: boolean | undefined
  constructor(
    public target: string,
    public scope: string
  ) {
    this.conditions = new Map()
  }
  // 添加条件规则到规则引擎中
  addCondition(condition: ConditionNode<string, Operator>) {
    const hash = condition.calculateHash()
    this.conditions.set(hash, condition)
  }

  // 匹配条件规则
  match(fact: Fact, comparor?: any) {
    // console.log(this.conditions)
    let res: boolean | undefined = undefined
    if(comparor === 'or') {
      res = Array.from(this.conditions.entries()).some(([, value]) => {
        const res = value.match(fact)
        if (res) {
          return true
        } else {
          return false
        }
      })
    } else {
      res = Array.from(this.conditions.entries()).every(([, value]) => {
        const res = value.match(fact)
        if (res) {
          return true
        } else {
          return false
        }
      })
    }
    
    this.result = res
    return res
  }
  getResult() {
    const res = Array.from(this.conditions.entries()).every(([, value]) => {
      const res = value.getResult()
      return res
    })
    return res
  }

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.target + this.scope
  }
  toJson() {
    return {
      target: this.target,
      scope: this.scope,
      conditions: Object.fromEntries(
        Array.from(this.conditions, ([key, value]) => [key, value.getResult()])
      )
    }
  }
}

export class RuleMatch {
  rules: Map<string, RuleNode>
  // static instance: any
  constructor() {
    this.rules = new Map()
    // if (!RuleMatch.instance) {
    //   RuleMatch.instance = this
    // }

    // return RuleMatch.instance
  }
  fromJson(ruleConf: any) {
    if (ruleConf instanceof Array) {
      ruleConf.forEach((rule: any) => {
        const ruleNode = new RuleNode(rule.target, rule.scope)
        rule.conditions.forEach((condition: any) => {
          const conditionNode = new ConditionNode(
            condition.field,
            condition.operator,
            condition.value
          )
          ruleNode.addCondition(conditionNode)
        })
        this.addRule(ruleNode)
      })
    }
    return this
  }

  // 添加条件规则到规则引擎中
  addRule(rule: RuleNode) {
    const hash = rule.calculateHash()
    if (this.rules.has(hash)) {
      const existRule: any = this.rules.get(hash)
      existRule.conditions.forEach((item: ConditionNode<string, Operator>) => {
        rule.addCondition(item)
      })
    }

    this.rules.set(hash, rule)
  }

  // 匹配条件规则
  match(target: string, scope: string, fact: Fact,  comparor?: any) {
    const hash = this.calculateHash(target, scope)

    const rule = this.rules.get(hash)
    if (rule) {
      const result = rule.match(fact, comparor)
      // this.matchCache.set(hash, result);
      return result
    } else {
      // 默认显示
      return true
    }
  }

  getResult(target: string, scope: string) {
    const hash = this.calculateHash(target, scope)
    const rule = this.rules.get(hash)
    if (rule) {
      const result = rule.getResult()
      return result
    } else {
      // 默认显示
      return true
    }
  }
  // 计算哈希值的方法
  calculateHash(target: string, scope: string): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return target + scope
  }
  findTargetsByField(field: string) {
    const rules = new Map(
      [...this.rules.entries()].filter(([, value]) => {
        return [...value.conditions.entries()].filter(([, value]) => {
          return value.field === field
        }).length
      })
    )
    return [...rules.values()].map((obj) => obj.target)
  }
  findRulesByField(field: string) {
    const list = [...this.rules.entries()]
    const match = list.filter(([, ruleValue]) => {
      const valuetemp = ruleValue
      const list = [...ruleValue.conditions.entries()]
      const res = list.filter(([, conditionValue]) => {
        const hit = (conditionValue.field === field )
        return hit
      })
      return res.length
    })
    console.log({match})
    return match
    // const rules = new Map(
    //   [...this.rules.entries()].filter(([, value]) => {
    //     return [...value.conditions.entries()].filter(([, value]) => {
    //       return value.field === field
    //     })
    //   })
    // )
    // return [...rules.values()]
  }
  findFieldsByTarget(target: string) {
    const rules = new Map(
      [...this.rules.entries()].filter(([, value]) => {
        return value.target === target
      })
    )
    
    // return [...rules.values()].map((obj) => obj.conditions)
    return [...rules.values()].map((obj) => [...obj.conditions.entries()].map(([, value]) => value.field))
    // return [...rules.values()].map((obj) => obj.target)
  }
  toJson() {
    return Array.from(this.rules.entries()).map(([, value]) => {
      return value.toJson()
    })
  }
}
