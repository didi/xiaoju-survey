import StartNode from './nodes/StartNode'
import EndNode from './nodes/EndNode'
import QNode from './nodes/QNode'
import QEdge from './edges/QEdge'

class NodeExtension {
  static pluginName = 'NodeExtension'
  constructor({ lf }) {
    lf.register(StartNode)
    lf.register(EndNode)
    lf.register(QNode)
    lf.register(QEdge)
    lf.setDefaultEdgeType('q-edge')
  }
}

export default NodeExtension
