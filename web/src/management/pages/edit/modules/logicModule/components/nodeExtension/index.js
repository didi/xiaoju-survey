import { createApp } from 'vue';
import StartNode  from "./nodes/StartNode";
import EndNode  from "./nodes/EndNode";
import QNode from './nodes/QNode';
import QEdge from './edges/QEdge';

class NodeExtension {
  static pluginName = 'NodeExtension'
  constructor ({ lf }) {
    lf.register(StartNode);
    lf.register(EndNode);
    lf.register(QNode);
    lf.register(QEdge);
    lf.setDefaultEdgeType('q-edge');
    this.app = createApp()
  }
  render(lf, domOverlay) {
    const node = document.createElement('div')
    node.className = 'node-red-palette'
    domOverlay.appendChild(node)
    this.app.mount(node)
  }
}

export default NodeExtension