<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="onPublish">
    发布
  </el-button>
</template>

<script>
import { get as _get } from 'lodash-es'
import { mapState } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { publishSurvey, saveSurvey, getConflictHistory } from '@/management/api/survey'
import { showLogicEngine } from '@/management/hooks/useShowLogicEngine'
import buildData from './buildData'

export default {
  name: 'PublishPanel',
  data() {
    return {
      isPublishing: false
    }
  },
  computed: {
    ...mapState({
      surveyId: (state) => _get(state, 'edit.surveyId')
    })
  },
  methods: {
    async checkConflict(surveyid) {
      try {
        const dailyHis = await getConflictHistory({surveyId: surveyid, historyType: 'dailyHis', sessionId: sessionStorage.getItem('sessionUUID')})
        console.log(dailyHis)
        if (dailyHis.data.length > 0) {
          const lastHis = dailyHis.data.at(0)
          if (Date.now() - lastHis.createDate > 2 * 60 * 1000) {
            return [false, '']
          } else {
            return [true, lastHis.operator.username]
          }
        }
      }catch (error) {
        console.log(error)
      }

      return [false, '']
    },


    async saveData() {
      console.log('savedata: '+ sessionStorage.getItem('sessionUUID'))
      // console.log(this.$store.state.edit.schemaUpdateTime)
      let res
      const saveData = buildData(this.$store.state.edit.schema, sessionStorage.getItem('sessionUUID'))
      if (!saveData.surveyId) {
        ElMessage.error('未获取到问卷id')
        return null
      }

      // 增加冲突检测
      const [isconflict, conflictName] = await this.checkConflict(saveData.surveyId)
      if(isconflict) {
        if (conflictName == this.$store.state.user.userInfo.username) {
          ElMessageBox.alert('当前问卷已在其它页面开启编辑，刷新以获取最新内容。', '提示', {
            confirmButtonText: '确认',
            callback: () => {
              location.reload(); 
            }
          });
        } else {
          ElMessageBox.alert(`当前问卷2分钟内由${conflictName}编辑，刷新以获取最新内容。`, '提示', {
            confirmButtonText: '确认',
            callback: () => {
              location.reload(); 
            }
          });
        }
        return null
      } else {
        // 保存数据
        res = await saveSurvey(saveData)
      }
      return res
    },


    async onPublish() {
      try {
        this.updateLogicConf()
      } catch (error) {
        ElMessage.error('请检查逻辑配置是否有误')
        return
      }
      // const saveData = buildData(this.$store.state.edit.schema, sessionStorage.getItem('sessionUUID'))
      // if (!saveData.surveyId) {
      //   ElMessage.error('未获取到问卷id')
      //   return
      // }
      // if (this.isPublishing) {
      //   return
      // }

      try {
        this.isPublishing = true
        // const saveRes = await saveSurvey(saveData)
        // if (saveRes.code !== 200) {
        //   ElMessage.error(saveRes.errmsg || '问卷保存失败')
        //   return
        // }
        const saveRes = await this.saveData()
        if (saveRes === null) {
          return
        }
        const publishRes = await publishSurvey({ surveyId: this.surveyId, sessionId: sessionStorage.getItem('sessionUUID') })
        if (publishRes.code === 200) {
          ElMessage.success('发布成功')
          this.$store.dispatch('edit/getSchemaFromRemote')
          this.$router.push({ name: 'publish' })
        } else {
          ElMessage.error(`发布失败 ${publishRes.errmsg}`)
        }
      } catch (error) {
        ElMessage.error(`发布失败`)
      } finally {
        this.isPublishing = false
      }
    },
    updateLogicConf() {
      if (showLogicEngine.value) {
        showLogicEngine.value.validateSchema()
        const showLogicConf = showLogicEngine.value.toJson()
        // 更新逻辑配置
        this.$store.dispatch('edit/changeSchema', { key: 'logicConf', value: { showLogicConf } })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.publish-btn {
  width: 100px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  padding: 0;
}
</style>
