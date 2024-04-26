import { getRandom } from '@/management/utils/index'

function generateID(prefix = 'r') {
  return `${prefix}-${getRandom(5)}`
}
export type ComposeOperator = 'AND' | 'OR';
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
export abstract class ConditionNode {
  id: string
  type: string
  constructor(type: string) {
    this.id = generateID('condi')
    this.type = type;
  }

  abstract calculateHash(): any
  abstract match(fact: Fact) : boolean
}

// 定义基本条件的类
export class BasicCondition<F extends string, O extends BasicOperator> extends ConditionNode {
  constructor(public field: F, public operator: O, public value: FieldTypes) {
    super('basic');
  }
  changeOperator(operator: O) {
    this.operator = operator;
  }
  changeValue(value: FieldTypes) {
    this.value = value;
  }
  changeField(field: F) {
    this.field = field;
  }
  calculateHash(): string {
    return this.field + this.operator + this.value;
  }
  match(fact: Fact): boolean {
    switch (this.operator) {
      case 'eq':
        if(this.value instanceof Array) {
          const res = this.value.every(v => fact[this.field].includes(v))
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'in':
        if(this.value instanceof Array) {
          const res = this.value.some(v => fact[this.field].includes(v))
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'nin':
        if(this.value instanceof Array) {
          const res = this.value.some(v => !fact[this.field].includes(v))
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      case 'neq':
        if(this.value instanceof Array) {
          const res = this.value.every(v => !fact[this.field].includes(v))
          return res
        } else {
          return fact[this.field].includes(this.value);
        }
      default:
        return false;
    }
  }
}

// // 定义组合条件的类
export class ComposeCondition<F extends string, V> extends ConditionNode {
  children: (BasicCondition<F, BasicOperator> | ComposeCondition<F, V>)[] = [];
  constructor(public operator: ComposeOperator) {
    super('compose');
  }
  calculateHash() {
    return this.operator;
  }
  // 加入规则
  add(condition: BasicCondition<F, BasicOperator> | ComposeCondition<F, V>) {
    this.children.push(condition);
  }
  // 删除规则
  remove(conditionId: string) {
    this.children = this.children.filter(c => c.id !== conditionId);
  }
  
  // 改变逻辑关系
  changeComparator(operator: ComposeOperator) {
    this.operator = operator;
  }
  // 查找节点方法
  findNode(conditionId: string): BasicCondition<F, BasicOperator> | ComposeCondition<F, V> | null {
    if (this.id === conditionId) {
      return this;
    }
    for (const child of this.children) {
      if (child instanceof ComposeCondition) {
        const found = child.findNode(conditionId);
        if (found) {
          return found;
        }
      } else if (child.id === conditionId) {
        return child;
      }
    }
    return null;
  }
  
  match(fact: Fact): boolean {
    if(this.operator === 'AND') {
      return Array.from(this.children.entries()).every(([key, value]) => {
        if (value.match(fact)) {
          return true;
        }
      });
    } else {
      return Array.from(this.children.entries()).some(([key, value]) => {
        if (value.match(fact)) {
          return true;
        }
      });
    } 
  }
}

// export type Condition<F extends string, O extends BasicOperator> = BasicCondition<F, O> | ComposeCondition<F, O>;

// // 定义示例数据生成函数
// function generateExampleData(): Condition<'gender' | 'age' | 'question2', BasicOperator> {
//   const condition1 = new BasicCondition('gender', 'in', ['male']);
//   const condition2 = new BasicCondition('age', 'eq', '18');

//   const subComposeCondition = new ComposeCondition<'question2', string>('AND');
//   const subCondition1 = new BasicCondition( 'question2', 'in', ['option1']);
//   const subCondition2 = new BasicCondition( 'question2', 'in', ['option2']);
//   const subCondition3 = new BasicCondition( 'question2', 'in', ['option3']);

//   subComposeCondition.add(subCondition1);
//   subComposeCondition.add(subCondition2);
//   subComposeCondition.add(subCondition3);

//   const mainComposeCondition = new ComposeCondition<'gender' | 'age' | 'question2', BasicOperator>('AND');
//   mainComposeCondition.add(condition1);
//   mainComposeCondition.add(condition2);
//   mainComposeCondition.add(subComposeCondition);

//   return mainComposeCondition;
// }

// // 生成示例数据
// const exampleData = generateExampleData();

// // 打印示例数据
// console.log(JSON.parse(JSON.stringify(exampleData)));


// /* 目标层级控制 */
// // 题目
// const questionStatus1 = {
//   "scope": "question",
//   "action" : {
//     "data005": 0 / 1
//   }
// }

// // 选项
// const questionStatus2 = {
//   "scope": "option",
//   "action" : {
//     "data005": {
//         "hash1": "0 / 1",  
//         "hash2": "0 / 1", 
//      }
//   }
// }
// const questionStatus3 = {
//   "scope": "option",
//   "action" : {
//     "data005": {
//         "sub": {
//           'hash1': "0 / 1",  
//           "hash2": "0 / 1", 
//         }
//      }
//   }
// }

// // 子题目
// const questionStatus4 ={
//   "scope": "sub",
//   "action" : {
//     "data005": {
//         "sub1": "0 / 1",  
//         "sub2": "0 / 1", 
//      }
//   }
// }

