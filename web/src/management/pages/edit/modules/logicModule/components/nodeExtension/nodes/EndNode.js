import { CircleNode, CircleNodeModel } from '@logicflow/core'

class EndNodeModel extends CircleNodeModel {
  constructor(data, graphModel) {
    data.text = {
      value: data.text,
      x: data.x,
      y: data.y
    }
    super(data, graphModel)

    this.r = 30
  }
  /**
   * 重写定义锚点
   */
  getDefaultAnchor() {
    const { x, y, id, width } = this
    const anchors = [
      {
        x: x - width / 2,
        y: y,
        id: `${id}_left`,
        type: 'left'
      }
    ]
    return anchors
  }
  setIsShowAnchor() {
    return false
  }
  isAllowConnectedAsSource() {
    return false
  }
}

export default {
  type: 'end-node',
  model: EndNodeModel,
  view: CircleNode
}
