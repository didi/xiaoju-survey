import { useEditStore } from '../stores/edit'
import { Operator } from '@/common/logicEngine/BasicType'
import { cleanRichText } from '@/common/xss'
import { CHOICES } from '@/common/typeEnum'

export const generateNodes = (questionDataList: [any]) => {
  let x = 50
  const y = 300
  const startNode = [
    {
      id: 'start',
      type: 'start-node',
      x: 50,
      y,
      text: '开始'
    }
  ]
  const nodes: any[] = questionDataList.map((item) => {
    x = x + 300
    let options = []
    if (CHOICES.includes(item.type)) {
      options = item?.options.map((option: any) => {
        return {
          key: option?.hash,
          type: cleanRichText(option?.text)
        }
      })
    }
    return {
      id: item?.field,
      type: 'q-node',
      x,
      y,
      properties: {
        questionType: item?.type,
        field: item.field,
        title: cleanRichText(item?.title),
        options
      }
    }
  })
  const endNode = [
    {
      id: 'end',
      type: 'end-node',
      x: x + 200,
      y,
      text: '结束'
    }
  ]
  return startNode.concat(nodes).concat(endNode)
}

/* 跳转逻辑的初始化 */
export const generateLine = (models: Array<any>) => {
  const acc: Array<any> = []
  const editStore = useEditStore()
  const jumpLogicRule = editStore.jumpLogicEngine?.toJson()

  const edges = models.reduce((prev: any, point: any, index: number, array: any[]) => {
    if (index === 0) {
      return acc
    }
    const previousPoint: any = array[index - 1]
    if (!previousPoint) {
      return acc
    }
    let edge
    if (previousPoint?.type === 'start-node') {
      // 开始节点连接线
      edge = {
        type: 'q-edge',
        sourceNodeId: previousPoint?.id,
        targetNodeId: point?.id,
        sourceAnchorId: `${previousPoint.anchors[0].id}`,
        targetAnchorId: `${point?.anchors[0].id}`,
        // properties: {
        draggable: false
        // }
      }
      acc.push(edge)
    } else if (previousPoint?.type === 'q-node') {
      // 生成题目节点连接线
      // 方案1：以条件节点为主体
      const editStore = useEditStore()
      const rules = editStore.jumpLogicEngine.findRulesByField(previousPoint.id)
      if (!jumpLogicRule.length || !rules.length) {
        edge = {
          type: 'q-edge',
          sourceNodeId: previousPoint?.id,
          targetNodeId: point?.id,
          sourceAnchorId: `${previousPoint.anchors[1].id}`,
          targetAnchorId: `${point?.anchors[0].id}`
        }
        acc.push(edge)
      } else {
        const hasDefault = rules.filter((i: any) => {
          return i.conditions.filter((item: any) => item.operator === Operator.NotEqual).length
        })
        if (!hasDefault.length) {
          // 如果规则中没有默认答题跳转则生成一条默认的题目答完链接线
          edge = {
            type: 'q-edge',
            sourceNodeId: previousPoint?.id,
            targetNodeId: point?.id,
            sourceAnchorId: `${previousPoint.anchors[1].id}`,
            targetAnchorId: `${point?.anchors[0].id}`
          }
          acc.push(edge)
        }
        rules.forEach((rule: any) => {
          const condition = rule.conditions[0]
          let sourceAnchorId = `${condition.field}_right`
          if (condition.operator === 'in') {
            sourceAnchorId = `${condition.value}_right`
          }
          const targetAnchorId = `${rule.target}_left`
          edge = {
            type: 'q-edge',
            sourceNodeId: previousPoint?.id,
            targetNodeId: rule.target,
            sourceAnchorId: `${sourceAnchorId}`,
            targetAnchorId: `${targetAnchorId}`,
            properties: {
              ruleId: rule.id
            }
          }
          acc.push(edge)
        })
      }
    } else {
      edge = {
        type: 'q-edge',
        sourceNodeId: previousPoint?.id,
        targetNodeId: point?.id,
        sourceAnchorId: `${previousPoint.anchors[1].id}`,
        targetAnchorId: `${point?.anchors[0].id}`,
        draggable: false
      }
      acc.push(edge)
    }

    return acc
  })
  return edges
}

export const getNodesStep = (source: string, target: string, questionDataList: any[]) => {
  const sourceIndex = questionDataList.findIndex((item: any) => item.field === source)
  const targetIndex = questionDataList.findIndex((item: any) => item.field === target)
  return targetIndex - sourceIndex
}
export const getCondition = (sourceInfo: any): any => {
  const { nodeId, anchorId } = sourceInfo
  const anchorKey = anchorId.split('_right')[0]
  if (nodeId === anchorKey) {
    // 答完跳转
    return {
      field: nodeId,
      operator: Operator.NotEqual,
      value: ''
    }
  } else {
    // 选中optionhash跳转
    return {
      field: nodeId,
      operator: Operator.Include,
      value: anchorKey
    }
  }
}
