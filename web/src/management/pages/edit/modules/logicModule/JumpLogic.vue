<script setup lang="ts">
import { onMounted, ref, watch, toRaw, computed } from 'vue'
import { ElMessageBox } from 'element-plus';
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import LogicFlow from '@logicflow/core'
import { MiniMap, Control } from "@logicflow/extension";
import "@logicflow/extension/lib/style/index.css";
import '@logicflow/core/es/index.css'


import { useEditStore } from '@/management/stores/edit'
import { RuleNode, ConditionNode } from '@/common/logicEngine/RuleBuild'

import { generateNodes, generateLine, getNodesStep, getCondition } from '@/management/hooks/useJumpLogicFlow'

import NodeExtension from './components/nodeExtension/index'

const editStore = useEditStore()

const jumpLogicEngine = computed(() => {
  return editStore.jumpLogicEngine
})
const questionDataList = computed(() => {
  return editStore.schema.questionDataList
})
const config: Partial<LogicFlow.Options> = {
  snapline: false,
  isSilentMode: false,
  stopScrollGraph: true,
  stopZoomGraph: true,
  style: {
    rect: {
      rx: 5,
      ry: 5,
      strokeWidth: 2
    },
    circle: {
      fill: '#f5f5f5',
      stroke: '#666'
    },
    ellipse: {
      fill: '#dae8fc',
      stroke: '#6c8ebf'
    },
    polygon: {
      fill: '#d5e8d4',
      stroke: '#82b366'
    },
    diamond: {
      fill: '#ffe6cc',
      stroke: '#d79b00'
    },
    text: {
      color: '#b85450',
      fontSize: 12
    }
  },
  adjustEdgeStartAndEnd: true, 
  adjustEdgeStart: false, 
  adjustEdgeEnd: true,
  // grid: true
}

const customTheme: Partial<LogicFlow.Theme> = {
  baseNode: {
    stroke: '#FBC559'
  },
  nodeText: {
    overflowMode: 'ellipsis',
    lineHeight: 1.5,
    fontSize: 13
  },
  edgeText: {
    overflowMode: 'ellipsis',
    lineHeight: 1.5,
    fontSize: 13,
    textWidth: 100
  }, // 确认 textWidth 是否必传
  polyline: {
    stroke: 'red'
  },
  rect: {
    width: 200,
    height: 40
  },
  arrow: {
    offset: 4, // 箭头长度
    verticalLength: 2 // 箭头垂直于边的距离
  }
}
const data = {
  nodes: []
}

const lfRef = ref<LogicFlow | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const initGraph = (questionDataList: any) => {
  const list = toRaw(questionDataList)
  if(list.length) {
    const nodes = generateNodes(list)
    let models:any[] = []
    nodes.forEach((item: any) => {
      const nodeModel = lfRef.value?.addNode(item)
      models.push(nodeModel)
    })
    const edges = generateLine(models)
    edges.forEach((item: any) => {
      const edgeModel = lfRef.value?.addEdge(item)
      if(edgeModel && ('start_node' === item.sourceNodeId || 'end_node' === item.targetNodeId)){
          edgeModel.draggable = false
          edgeModel.isSelected = false 
          edgeModel.isShowAdjustPoint = false
      }
    })
  }
}

const registerEvents = (lf: LogicFlow) => {
  // 更新从选项拉出的逻辑
  lf.on('anchor:drop', ({ edgeModel }) => {
    /*  添加规则 **/
    const { sourceNodeId, sourceAnchorId, targetNodeId } = edgeModel
    const target = targetNodeId
    const {
      field,
      operator,
      value,
    } = getCondition({
      anchorId: sourceAnchorId,
      nodeId: sourceNodeId
    })
    const conditionNode = new ConditionNode(field, operator, value)
    
    const ruleNode = new RuleNode(target)
    ruleNode.addCondition(conditionNode)
    edgeModel.setProperties({
      ruleId: ruleNode.id,
      conditionId: conditionNode.id
    });
    jumpLogicEngine.value.addRule(ruleNode)
  })
  // 调整边的起点和终点，更新题目默认的连接线
  lf.on('edge:exchange-node', ({ data }: any) => {
    console.log('edge:exchange-node', {data})
    /* 更新规则目标 **/
    
    const { newEdge, oldEdge } = data
    
    const ruleId = oldEdge.properties.ruleId
    // 如果新的连接线，默认的步长 == 1 
    if(getNodesStep(newEdge.sourceNodeId, newEdge.targetNodeId, questionDataList.value) === 1 && ruleId){
      /** 删除逻辑。step n --> 1 */
      console.log('删除逻辑。step n --> 1')
      jumpLogicEngine.value.removeRule(ruleId)
    } else {
      if(ruleId) {
        /**  更新逻辑.   step n --> m */
        console.log('更新逻辑.   step n --> m ')
        // const ruleId = oldEdge.properties.ruleId
        const ruleNode = jumpLogicEngine.value.findRule(ruleId)
        ruleNode.setTarget(newEdge.targetNodeId)
      } else {
        /** 添加逻辑。step 1 --> n */
        console.log('添加逻辑。step 1 --> n')
        const newEdgeModel = lf.graphModel.getEdgeModelById(newEdge.id);
 
        const { sourceNodeId, sourceAnchorId } = newEdge
        const {
          field,
          operator,
          value,
        } = getCondition({
          anchorId: sourceAnchorId,
          nodeId: sourceNodeId
        })
        const conditionNode = new ConditionNode(field, operator, value)
        
        const ruleNode = new RuleNode(newEdge.targetNodeId)
        ruleNode.addCondition(conditionNode)
        newEdgeModel?.setProperties({
          ruleId: ruleNode.id,
          conditionId: conditionNode.id
        });
        jumpLogicEngine.value.addRule(ruleNode)
      }
       
    }
  });
}
onMounted(() => {
  if (containerRef.value) {
    const lf = new LogicFlow({
      ...config,
      container: containerRef.value,
      // height: 700,
      translateCenter: true,
      multipleSelectKey: 'shift',
      disabledTools: ['multipleSelect'],
      autoExpand: true,
      // metaKeyMultipleSelected: false,
      // adjustEdgeMiddle: true,
      // stopMoveGraph: true,
      adjustEdgeStartAndEnd: true,
      // adjustEdge: false,
      allowRotate: false,
      edgeTextEdit: false,
      nodeTextEdit: false,
      keyboard: {
        enabled: true,
        shortcuts: [
          {
            keys: ["backspace"],
            callback: () => {
              // const r = window.confirm("");
                ElMessageBox.confirm('确定要删除吗？', '删除提示', {
                  confirmButtonText: '确定',
                  showCancelButton: false,
                  // cancelButtonText: '取消',
                  type: 'warning'
                })
                  .then(async () => {
                    const elements = lf.getSelectElements(true);
                    lf.clearSelectElements();
                    elements.edges.forEach((edge) => {
                      console.log({edge})
                      const { sourceNodeId, sourceAnchorId } = edge
                      if(sourceAnchorId?.split('_right')[0] === sourceNodeId){
                        ElMessage({
                          message: '题目答完跳转的连接线不可以删除',
                          type: 'warning',
                        })
                      } else {
                        const { properties } = edge
                        jumpLogicEngine.value.removeRule(properties?.ruleId)
                        lf.deleteEdge(edge.id)
                      }
                    });
                    console.log(42, elements)
                  })
                  .catch(() => {

                  })
            }
          }
        ]
      },
      partial: false,
      background: {
        color: '#FFFFFF'
      },
      edgeTextDraggable: false,
      edgeType: 'bezier',
      style: {
        inputText: {
          background: 'black',
          color: 'white'
        }
      },
      // 全局自定义id
      // edgeGenerator: (sourceNode, targetNode, currentEdge) => {
      //   // 起始节点类型 rect 时使用 自定义的边 custom-edge
      //   if (sourceNode.type === 'rect') return 'bezier'
      //   if (currentEdge) return currentEdge.type
      //   return 'polyline'
      // },
      idGenerator(type) {
        return type + '_' + Math.random()
      },
      plugins: [
        NodeExtension,
        MiniMap,
        Control
      ],
      pluginsOptions: {
        miniMap: {
          width: 284,
          height: 84,
          isShowHeader: false,
          isShowCloseIcon: false,
          leftPosition: 0,
          rightPosition: 0,
          bottomPosition: 50,
          showEdge: false,
          isShow: true
        }
      }
    })
    
    lf.setTheme(customTheme)
    registerEvents(lf)
    const control = lf.extension.control as Control
    control.removeItem('zoom-out')
    control.removeItem('zoom-in')
    control.removeItem('reset')
    control.removeItem('reset')
    control.removeItem('undo')
    control.removeItem('redo')
    control.addItem({
      key: 'zoom-out',
      iconClass: 'iconfont icon-suoxiao',
      title: '缩小流程图',
      text: '缩小',
      onClick: () => {
        lf.zoom(false)
      },
    });
    control.addItem({
      key: 'zoom-in',
      iconClass: 'iconfont icon-fangda',
      title: '放大流程图',
      text: '放大',
      onClick: () => {
        lf.zoom(true)
      },
    })
    control.addItem({
      key: 'reset',
      iconClass: 'iconfont icon-shiying',
      title: '恢复流程原有尺寸',
      text: '适应',
      onClick: () => {
        lf.resetZoom()
      },
    })
    // lf.extension.control.addItem({
    //   key: 'mini-map',
    //   iconClass: "custom-minimap",
    //   title: "",
    //   text: "导航",
    //   onMouseEnter: (lf, ev) => {
    //     const position = lf.getPointByClient(ev.x, ev.y);
    //     lf.extension.miniMap.show(
    //       position.domOverlayPosition.x,
    //       position.domOverlayPosition.y
    //     );
    //   },
    //   onClick: (lf, ev) => {
    //     const position = lf.getPointByClient(ev.x, ev.y);
    //     lf.extension.miniMap.show(
    //       position.domOverlayPosition.x,
    //       position.domOverlayPosition.y
    //     );
    //   },
    // });


    lf.render(data)
    const miniMap  = lf.extension.miniMap as MiniMap
    miniMap?.show()


    lfRef.value = lf
    if(questionDataList.value.length) {
      initGraph(questionDataList.value)
    }
  }
})

watch(() => questionDataList.value, (value) => {
  const list = toRaw(value)
  if(list.length) {
    initGraph(list)
  }
})

</script>

<template>
 <div ref="containerRef" id="graph" class="viewport"></div>
</template>

<style lang="scss">
.flex-wrapper {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.viewport {
  height: 100%;
}

.el-button + .el-button {
  margin-left: 0;
}

*:focus {
  outline: none;
}

.rect {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;
}

.circle {
  width: 50px;
  height: 50px;
  background: #fff;
  border: 2px solid #000;
  border-radius: 50%;
}

.uml-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background: rgb(255 242 204);
  border: 1px solid rgb(214 182 86);
  border-radius: 10px;
}

.uml-head {
  font-weight: bold;
  font-size: 16px;
  line-height: 30px;
  text-align: center;
}

.uml-body {
  padding: 5px 10px;
  font-size: 12px;
  border-top: 1px solid rgb(214 182 86);
  border-bottom: 1px solid rgb(214 182 86);
}

.uml-footer {
  padding: 5px 10px;
  font-size: 14px;
}

/* 输入框字体大小和设置的大小保持一致，自动换行输入和展示保持一致 */

.lf-text-input {
  font-size: 12px;
}

.buttons {
  position: absolute;
  z-index: 1;
}

.button-list {
  display: flex;
  align-items: center;
}

/* .sql { */
  .table-container {
    box-sizing: border-box;
    padding: 10px;
  }

  .table-node {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  }

  .table-node::before {
    display: block;
    width: 100%;
    height: 8px;
    background: #FBC559;
    content: '';
  }

  .table-node.table-color-1::before {
    background: #9673a6;
  }

  .table-node.table-color-2::before {
    background: #dae8fc;
  }

  .table-node.table-color-3::before {
    background: #82b366;
  }

  .table-node.table-color-4::before {
    background: #f8cecc;
  }

  .table-name {
    padding: 0 10px;
    height: 32px;
    font-size: 14px;
    line-height: 32px;
    text-align: left;
    color: #4A4C5B;
    width:180px; 
    white-space:nowrap; 
    overflow:hidden; 
    text-overflow:ellipsis;
    font-weight: 500;
  }

  .table-feild {
    height: 28x;
    padding: 0 10px;
    font-size: 14px;
    line-height: 28px;
    white-space:nowrap; 
    overflow:hidden; 
    color: #4A4C5B;
    text-overflow:ellipsis;
  }

  .feild-type {
    color: #9f9c9f;
  }
  /* 自定义锚点样式 */
  .custom-anchor {
    cursor: crosshair;
    fill: #d9d9d9;
    stroke: #999;
    stroke-width: 1;
    rx: 3;
    ry: 3;
  }

  .custom-anchor:hover {
    fill: #ff7f0e;
    stroke: #ff7f0e;
  }

  .lf-node-not-allow .custom-anchor:hover {
    cursor: not-allowed;
    fill: #d9d9d9;
    stroke: #999;
  }

  .incomming-anchor {
    stroke: #d79b00;
  }

  .outgoing-anchor {
    stroke: #82b366;
  }
/* } */
.lf-mini-map{
    position: absolute;
    width: 300px;
    height: 100px;
    background: #F6F7F9;
    border: none;
    box-shadow: 0 2px 10px -2px rgba(82,82,102,0.20);
    border-radius: 4px;
}
.lf-control {
  .iconfont{
    color:#6E707C
  }
  color:#6E707C
} 
</style>
