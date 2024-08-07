import { HtmlNode, HtmlNodeModel, h } from '@logicflow/core'

class QNode extends HtmlNode {
  /**
   * 1.1.7版本后支持在view中重写锚点形状。
   * 重写锚点新增
   */
  getAnchorShape(anchorData) {
    const { x, y, type } = anchorData
    return h('rect', {
      x: x - 5,
      y: y - 5,
      width: 10,
      height: 10,
      className: `custom-anchor ${type === 'left' ? 'incomming-anchor' : 'outgoing-anchor'}`
    })
  }
  setHtml(rootEl) {
    rootEl.innerHTML = ''
    const {
      properties: { options = [], title }
    } = this.props.model
    rootEl.setAttribute('class', 'table-container')
    const container = document.createElement('div')
    container.className = `table-node`
    const tableNameElement = document.createElement('div')
    tableNameElement.innerHTML = title
    tableNameElement.className = 'table-name'
    container.appendChild(tableNameElement)
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < options.length; i++) {
      const item = options[i]
      const itemElement = document.createElement('div')
      itemElement.className = 'table-feild'
      const itemKey = document.createElement('span')
      itemKey.innerHTML = item.type
      itemElement.appendChild(itemKey)
      // itemKey.innerText = item.key;
      // const itemType = document.createElement('span');
      // itemType.innerHTML = item.type;
      // itemType.className = 'feild-type';
      // itemElement.appendChild(itemType);
      fragment.appendChild(itemElement)
    }
    container.appendChild(fragment)
    rootEl.appendChild(container)
  }
}

class QNodeModel extends HtmlNodeModel {
  getOutlineStyle() {
    const style = super.getOutlineStyle()
    style.stroke = 'none'
    style.hover.stroke = 'none'
    return style
  }
  // 如果不用修改锚地形状，可以重写颜色相关样式
  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle()
    if (anchorInfo.type === 'left') {
      style.fill = 'red'
      style.hover.fill = 'transparent'
      style.hover.stroke = 'transpanrent'
      style.className = 'lf-hide-default'
    } else {
      style.fill = 'green'
    }
    return style
  }
  setAttributes() {
    this.width = 200
    const {
      properties: { options = [] }
    } = this
    this.height = 60 + options.length * 28
    const circleOnlyAsTarget = {
      message: '只允许从右边的锚点连出',
      validate: (sourceNode, targetNode, sourceAnchor) => {
        return sourceAnchor.type === 'right'
      }
    }
    this.sourceRules.push(circleOnlyAsTarget)
    this.targetRules.push({
      message: '只允许连接左边的锚点',
      validate: (sourceNode, targetNode, sourceAnchor, targetAnchor) => {
        return targetAnchor.type === 'left'
      }
    })
  }
  getDefaultAnchor() {
    const {
      id,
      x,
      y,
      width,
      height,
      properties: { options }
    } = this
    const anchors = [
      {
        x: x - width / 2 + 10,
        y: y - height / 2 + 60 - 28,
        id: `${id}_left`,
        edgeAddable: false,
        type: 'left'
      },
      {
        x: x + width / 2 - 10,
        y: y - height / 2 + 60 - 28,
        id: `${id}_right`,
        edgeAddable: false,
        type: 'right'
      }
    ]

    options.forEach((feild, index) => {
      const anchorId = `${feild.key}_right`
      const { edges } = this.outgoing
      let edgeAddable = true
      if (edges.length) {
        const sourceAnchorIds = edges.map((edge) => edge.sourceAnchorId)
        edgeAddable = !sourceAnchorIds.includes(anchorId)
      }
      anchors.push({
        x: x + width / 2 - 10,
        y: y - height / 2 + 60 - 28 + (index + 1) * 30,
        id: anchorId,
        type: 'right',
        key: feild.key,
        edgeAddable
      })
    })
    return anchors
  }
  setIsShowAnchor() {
    return false
  }
  // 获取当前节点作为边的起始节点规则。
  // getConnectedSourceRules() {
  //   const rules = super.getConnectedSourceRules();
  //   // 开始节点的锚点只能拉出一条连接线
  //   const geteWayOnlyAsTarget = {
  //     message: "开始节点的锚点只能拉出一条连接线",
  //     validate: (
  //       source,
  //       target,
  //       sourceAnchor,
  //       targetAnchor
  //     ) => {
  //       // 获取该节点下目标连接线
  //       const edges = this.graphModel.getNodeOutgoingEdge(source.id);
  //       console.log({edges});
  //       // 如果连接线的锚点id存在则不允许链接
  //       const sourceAnchorIds = edges.map(edge => edge.sourceAnchorId);
  //       // 判断该新拉出的边是否已经有了目标链接，有的话disable
  //       let isValid = true;
  //       if (sourceAnchorIds.includes(sourceAnchor.id)) {
  //         isValid = false;
  //       }
  //       console.log(edges[0].targetNodeId,target.id, sourceAnchorIds, sourceAnchor.id, isValid)
  //       return isValid;
  //     },
  //   };
  //   // 如果该题存在无条件跳转则禁用选项跳转

  //   // 如果该题存在选项跳转则禁用无条件跳转

  //   rules.push(geteWayOnlyAsTarget);
  //   return rules;
  // }
}

export default {
  type: 'q-node',
  model: QNodeModel,
  view: QNode
}
