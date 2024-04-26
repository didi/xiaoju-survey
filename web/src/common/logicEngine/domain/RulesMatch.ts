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

// 定义条件规则类
export class ConditionNode<F extends string, O extends BasicOperator> {
  // 默认显示
  public result: boolean | null = null;
  constructor(public field: F, public operator: O, public value: FieldTypes) {
  }

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.field + this.operator + this.value;
  }
  match(fact: Fact): boolean {
    console.log(this.calculateHash())
    switch (this.operator) {
      case 'eq':
        if(this.value instanceof Array) {
          const res = this.value.every(v => fact[this.field].includes(v))
          this.result = res
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'in':
        if(this.value instanceof Array) {
          const res = this.value.some(v => fact[this.field].includes(v))
          this.result = res
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'nin':
        if(this.value instanceof Array) {
          const res = this.value.some(v => !fact[this.field].includes(v))
          this.result = res
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'neq':
        if(this.value instanceof Array) {
          const res = this.value.every(v => !fact[this.field].includes(v))
          this.result = res
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      // 其他比较操作符的判断逻辑
      default:
        return false;
    }
  }

  getResult() {
    return this.result
  }
}

export class RuleNode {
  target: string; // 作用目标题
  scope: string; // 作用范围，题目或选项
  conditions: Map<string, ConditionNode<string, BasicOperator>>; // 使用哈希表存储条件规则对象
  
  constructor(target: string, scope: string) {
    this.target = target;
    this.scope = scope;
    this.conditions = new Map();
  }
  // 添加条件规则到规则引擎中
  addCondition(condition: ConditionNode<string, BasicOperator>) {
    const hash = condition.calculateHash();
    this.conditions.set(hash, condition);
  }

  // 匹配条件规则
  match(fact: Fact) {
    // console.log(this.target + '规则匹配')
    const res =  Array.from(this.conditions.entries()).every(([key, value]) => {
      const res = value.match(fact)
      if (res) {
        return true;
      } else {
        return false
      }
    });
    return res
    // this.matchCache.set(hash, res);
  }
  getResult() {
    return Array.from(this.conditions.entries()).map(([key, value]) => {
      return value.getResult()
    })
  }

  // 计算条件规则的哈希值
  calculateHash(): string {
    // 假设哈希值计算方法为简单的字符串拼接或其他哈希算法
    return this.target + this.scope;
  }

}



export class RuleMatch {
  rules: Map<string, RuleNode>;
  // matchCache: Map<string, boolean>;


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
    // this.matchCache = new Map();
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
}

// const engine = new RuleMatch(ruleConf)
// // 示例数据
// const fact1: Fact = { q1: ['选项1', '选项2']};
// // 进行匹配测试
// const res = engine.match('q3-o1', 'option', fact1);

// console.log(engine, res)