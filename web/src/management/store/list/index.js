import { createSpace, spaceList, spaceDetail, updateSpace, spaceDelete } from '@/management/api/space'
import { CODE_MAP } from '@/management/api/base'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { getSurveyList as surveyList } from '@/management/api/survey'
import { set } from 'lodash-es'
import { SpaceType } from '@/management/utils/types/workSpace'
export default {
  namespaced: true,
  state: {
    spaceMenus: [
      {
        icon: 'i-ep-menu',
        name: '个人空间',
        id: SpaceType.Personal
      },
      {
        icon: 'i-ep-menu',
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
    teamSpaceList: [],
    surveyList: [],
    surveyTotal: 0,
  },
  mutations: {
    updateSpaceMenus(state, teamSpace){
      // 更新空间列表下的团队空间
      set(state, 'spaceMenus[1].children', teamSpace)
    },
    changeSpaceType(state, spaceType) {
      state.spaceType = spaceType
    },
    changeWorkSpace(state, workSpaceId){
      state.workSpaceId = workSpaceId
    },
    setSpaceDetail(state, data) {
      state.spaceDetail = data
    },
    setTeamSpaceList(state, data) {
      state.teamSpaceList = data
    },
    setSurveyList(state, list) {
      state.surveyList = list
    },
    setSurveyTotal(state, total) {
      state.surveyTotal = total
    }
  },
  actions: {
    async getSpaceList({ commit }) {
      try {
        const res = await spaceList()
        
        if (res.code === CODE_MAP.SUCCESS) {
          const { list } = res.data
          const teamSpace = list.map(item => {
            return {
              id: item._id,
              name: item.name
            }
          })
          commit('setTeamSpaceList', list)
          commit('updateSpaceMenus', teamSpace)
        } else {
          ElMessage.error('getSpaceList' + res.errmsg)
        }
      } catch (err) {
        ElMessage.error('getSpaceList' + err)
      }
    },
    async addSpace({ }, params) {
      try {
        const res = await createSpace({
          name: params.name,
          description: params.description,
          members: params.members
        })
    
        if (res.code === CODE_MAP.SUCCESS) {
          ElMessage.success('添加成功')
        } else {
          ElMessage.error('createSpace  code err'+res.errmsg)
        }
      } catch (err) {
        throw err
      }
    },
    async getSpaceDetail({ state, commit }, id) {
      try {
        const workspaceId = id || state.workSpaceId
        const res = await spaceDetail(workspaceId)
        if (res.code === CODE_MAP.SUCCESS) {
          
          commit('setSpaceDetail', res.data)
        } else {
          ElMessage.error('getSpaceList' + res.errmsg)
        }
      } catch (err) {
        ElMessage.error('getSpaceList' + err)
      }
    },
    async updateSpace({ }, params) {
      try {
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
      } catch (err) {
        ElMessage.error(err)
      }
    },
    async deleteSpace({ }, workspaceId) {
      try {
        const res = await spaceDelete(workspaceId)
    
        if (res.code === CODE_MAP.SUCCESS) {
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (err) {
        ElMessage.error(err)
      }
    },
    async getSurveyList({ commit}, params) {
      try {
        if(!params) {
          params = {
            pageSize: 10,
            curPage: 1,
          }
        }
        const res = await surveyList(params)
        if (res.code === CODE_MAP.SUCCESS) {
          commit('setSurveyList', res.data.data)
          commit('setSurveyTotal', res.data.count)
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (error) {
        ElMessage.error(error)
      }
    }
  }
}
