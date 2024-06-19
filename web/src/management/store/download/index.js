import 'element-plus/theme-chalk/src/message.scss'
import { getDownloadList, deleteDownloadFile } from '@/management/api/download'

export default {
  namespaced: true,
  state: {
    surveyList: [],
    surveyTotal: 0,
    currentRow: []
  },
  mutations: {
    setSurveyList(state, list) {
      state.surveyList = list
    },
    setSurveyTotal(state, total) {
      state.surveyTotal = total
    },
    setCurrentRow(state, row) {
      state.currentRow = row
    }
  },
  actions: {
    async setRow({ commit }, payload) {
      commit('setCurrentRow', payload)
    },
    async getDownloadList({ commit }, payload) {
      let params = {
        ownerId: payload.ownerId,
        page: payload.page ? payload.page : 1,
        pageSize: payload.pageSize ? payload.pageSize : 15
      }
      try {
        const { data } = await getDownloadList(params)
        console.log(data)
        commit('setSurveyList', data.listBody)
        commit('setSurveyTotal', data.total)
      } catch (e) {
        console.error(e)
      }
    },
    async DownloadFileByName(payload) {
      let params = {
        fileName: payload.fileName
      }
      try {
        const { data } = await deleteDownloadFile(params)
        console.log(data)
      } catch (e) {
        console.error(e)
      }
    }
  },
  getters: {}
}
