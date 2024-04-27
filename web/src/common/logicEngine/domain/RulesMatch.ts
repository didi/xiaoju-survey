import { type BasicOperator, type FieldTypes, type Fact  } from "./BasicType";

// 定义条件规则类
export class ConditionNode<F extends string, O extends BasicOperator> {
  // 默认显示
  public result: boolean = false;
  constructor(public field: F, public operator: O, public value: FieldTypes) {
  }

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.field + this.operator + this.value;
  }
  
  match(facts: Fact): boolean {
    // console.log(this.calculateHash())
    // 如果该特征在事实对象中不存在，则直接返回false
    if(!facts[this.field]) {
      this.result = false
      return this.result
    }
    switch (this.operator) {
      case 'eq':
        if(this.value instanceof Array) {
          this.result = this.value.every(v => facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value);
          return this.result
        }
      case 'in':
        if(this.value instanceof Array) {
          this.result = this.value.some(v => facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value);
          return this.result
        }
      case 'nin':
        if(this.value instanceof Array) {
          this.result = this.value.some(v => !facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value);
          return this.result
        }
      case 'neq':
        if(this.value instanceof Array) {
          this.result = this.value.every(v => !facts[this.field].includes(v))
          return this.result
        } else {
          this.result = facts[this.field].includes(this.value);
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
  conditions: Map<string, ConditionNode<string, BasicOperator>>; // 使用哈希表存储条件规则对象
  
  constructor(public target: string, public scope: string) {
    this.conditions = new Map();
  }
  // 添加条件规则到规则引擎中
  addCondition(condition: ConditionNode<string, BasicOperator>) {
    const hash = condition.calculateHash();
    this.conditions.set(hash, condition);
  }

  // 匹配条件规则
  match(fact: Fact) {
    console.log(this.target + '规则匹配')
    const res =  Array.from(this.conditions.entries()).every(([key, value]) => {
      const res = value.match(fact)
      if (res) {
        return true;
      } else {
        return false
      }
    });
    return res
  }
  getResult() {
    const res = Array.from(this.conditions.entries()).every(([key, value]) => {
      const res = value.getResult()
      return res
    })
    return res
  }

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.target + this.scope;
  }
  toJson() {
    return {
      target: this.target,
      scope: this.scope,
      conditions: Object.fromEntries(
        Array.from(this.conditions, ([key, value]) => [key, value.getResult()])
      )
    };
  }
  batchMatch(facts: Fact) {
    return {
      target: this.target,
      scope: this.scope,
      matched: this.match(facts)
    };
  }

}

export class RuleMatch {
  rules: Map<string, RuleNode>;
  static ruleConf: any;
  constructor(ruleConf: any) {
    this.rules = new Map();
    ruleConf.forEach((rule: any) => {
      const ruleNode = new RuleNode(rule.target, rule.scope);
      rule.conditions.forEach((condition: any) => {
        const conditionNode =  new ConditionNode(condition.field, condition.operator, condition.value);
          ruleNode.addCondition(conditionNode)
      });
      this.addRule(ruleNode)
    })
    RuleMatch.ruleConf = ruleConf
  }

  // 添加条件规则到规则引擎中
  addRule(rule: RuleNode) {
    const hash = rule.calculateHash();
    this.rules.set(hash, rule);
  }


  // 匹配条件规则
  match(target: string, scope: string, fact: Fact) {
    const hash = this.calculateHash(target, scope);

    const rule = this.rules.get(hash);
    if (rule) {
      const result = rule.match(fact)
      // this.matchCache.set(hash, result);
      return result
    } else {
      // 默认显示
      return true
    }
  }
  
  getResult(target: string, scope: string) {
    const hash = this.calculateHash(target, scope);
    const rule = this.rules.get(hash);
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
    return target + scope;
  }
  findTargets(field: string) {
    const nodes = RuleMatch.ruleConf.filter((rule: any) => {
      const conditions =  rule.conditions.filter((item: any) => {
        return item.field === field
      })
      return conditions.length > 0
    })
    return nodes.map((item: any) => {
      return item.target
    })
  }
  toJson() {
    return Array.from(this.rules.entries()).map(([key, value]) => {
      return value.toJson()
    })
    // return this.rules.forEach((rule) => {
    //   return rule.toJson()
    // })
  }
  batchMatch(facts: Fact) {
    return Array.from(this.rules.entries()).map(([key, value]) => {
      return value.batchMatch(facts)
    })
  }
}
