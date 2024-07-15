import {
  createSpace,
  getSpaceList,
  getSpaceDetail,
  updateSpace,
  deleteSpace
} from '@/management/api/space'
import { CODE_MAP } from '@/management/api/base'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { getSurveyList as surveyList } from '@/management/api/survey'
import { set } from 'lodash-es'
import { SpaceType } from '@/management/utils/types/workSpace'

export default {
  namespaced: true,
  state: {
    // 空间管理
    spaceMenus: [
      {
        icon: 'icon-wodekongjian',
        name: '我的空间',
        id: SpaceType.Personal
      },
      {
        icon: 'icon-tuanduikongjian',
        name: '团队空间',
        id: SpaceType.Group,
        children: [
          // {
          //   name: '小桔问卷调研团队',
          //   id: 'xxxx',
          // }
        ]
      }
    ],
    spaceType: SpaceType.Personal,
    workSpaceId: '',
    spaceDetail: null,
    // 团队空间
    teamSpaceList: [],
    teamSpaceListTotal: 0,
    // 列表管理
    surveyList: [],
    surveyTotal: 0,
    searchVal: '',
    selectValueMap: {
      surveyType: '',
      'curStatus.status': ''
    },
    buttonValueMap: {
      'curStatus.date': '',
      createDate: -1
    }
  },
  getters: {
    listFliter(state) {
      return [
        {
          comparator: '',
          condition: [
            {
              field: 'title',
              value: state.searchVal,
              comparator: '$regex'
            }
          ]
        },
        {
          comparator: '',
          condition: [
            {
              field: 'curStatus.status',
              value: state.selectValueMap['curStatus.status']
            }
          ]
        },
        {
          comparator: '',
          condition: [
            {
              field: 'surveyType',
              value: state.selectValueMap.surveyType
            }
          ]
        }
      ]
    },
    listOrder(state) {
      const { buttonValueMap } = state
      return Object.entries(buttonValueMap)
        .filter(([, effectValue]) => effectValue)
        .reduce((prev, item) => {
          const [effectKey, effectValue] = item
          prev.push({ field: effectKey, value: effectValue })
          return prev
        }, [])
    }
  },
  mutations: {
    updateSpaceMenus(state, teamSpace) {
      // 更新空间列表下的团队空间
      set(state, 'spaceMenus[1].children', teamSpace)
    },
    changeSpaceType(state, spaceType) {
      state.spaceType = spaceType
    },
    changeWorkSpace(state, workSpaceId) {
      // 切换空间清除筛选条件
      this.commit('list/resetSelectValueMap')
      this.commit('list/resetButtonValueMap')
      this.commit('list/setSearchVal', '')
      state.workSpaceId = workSpaceId
    },
    setSpaceDetail(state, data) {
      state.spaceDetail = data
    },
    setTeamSpaceList(state, data) {
      state.teamSpaceList = data
    },
    setTeamSpaceListTotal(state, teamSpaceListTotal) {
      state.teamSpaceListTotal = teamSpaceListTotal
    },
    setSurveyList(state, list) {
      state.surveyList = list
    },
    setSurveyTotal(state, total) {
      state.surveyTotal = total
    },
    setSearchVal(state, data) {
      state.searchVal = data
    },
    resetSelectValueMap(state) {
      state.selectValueMap = {
        surveyType: '',
        'curStatus.status': ''
      }
    },
    changeSelectValueMap(state, { key, value }) {
      state.selectValueMap[key] = value
    },
    resetButtonValueMap(state) {
      state.buttonValueMap = {
        'curStatus.date': '',
        createDate: -1
      }
    },
    changeButtonValueMap(state, { key, value }) {
      state.buttonValueMap[key] = value
    }
  },
  actions: {
    async getSpaceList({ commit }, p = { curPage: 1 }) {
      try {
        const res = await getSpaceList(p)
        if (res.code === CODE_MAP.SUCCESS) {
          const { list, count } = res.data
          const teamSpace = list.map((item) => {
            return {
              id: item._id,
              name: item.name
            }
          })
          commit('setTeamSpaceListTotal', count)
          commit('setTeamSpaceList', list)
          commit('updateSpaceMenus', teamSpace)
        } else {
          ElMessage.error('getSpaceList' + res.errmsg)
        }
      } catch (err) {
        ElMessage.error('getSpaceList' + err)
      }
    },
    async addSpace({}, params) {
      const res = await createSpace({
        name: params.name,
        description: params.description,
        members: params.members
      })

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('添加成功')
      } else {
        ElMessage.error('createSpace  code err' + res.errmsg)
      }
    },
    async getSpaceDetail({ state, commit }, id) {
      try {
        const workspaceId = id || state.workSpaceId
        const res = await getSpaceDetail(workspaceId)
        if (res.code === CODE_MAP.SUCCESS) {
          commit('setSpaceDetail', res.data)
        } else {
          ElMessage.error('getSpaceList' + res.errmsg)
        }
      } catch (err) {
        ElMessage.error('getSpaceList' + err)
      }
    },
    async updateSpace({}, params) {
      const res = await updateSpace({
        workspaceId: params._id,
        name: params.name,
        description: params.description,
        members: params.members
      })

      if (res.code === CODE_MAP.SUCCESS) {
        ElMessage.success('更新成功')
      } else {
        ElMessage.error(res.errmsg)
      }
    },
    async deleteSpace({}, workspaceId) {
      try {
        const res = await deleteSpace(workspaceId)

        if (res.code === CODE_MAP.SUCCESS) {
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (err) {
        ElMessage.error(err)
      }
    },
    async getSurveyList({ state, getters, commit }, payload) {
      const filterString = JSON.stringify(
        getters.listFliter.filter((item) => {
          return item.condition[0].value
        })
      )
      const orderString = JSON.stringify(getters.listOrder)
      try {
        let params = {
          curPage: payload?.curPage || 1,
          pageSize: payload?.pageSize || 10, // 默认一页10条
          filter: filterString,
          order: orderString,
          workspaceId: state.workSpaceId
        }
        // if(payload?.order) {
        //   params.order = payload.order
        // }
        // if(payload.filter) {
        //   params.filter = payload.filter
        // }
        // if(payload?.workspaceId) {
        //   params.workspaceId = payload.workspaceId
        // }
        const res = await surveyList(params)
        if (res.code === CODE_MAP.SUCCESS) {
          commit('setSurveyList', res.data.data)
          commit('setSurveyTotal', res.data.count)
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (error) {
        ElMessage.error('getSurveyList status' + error)
      }
    }
  }
}
