<template>
  <el-button type="primary" :loading="isPublishing" class="publish-btn" @click="onPublish">
    发布
  </el-button>
</template>

<script>
import { get as _get } from 'lodash-es'
import { mapState } from 'vuex'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { publishSurvey, saveSurvey } from '@/management/api/survey'
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
    async onPublish() {
      try {
        this.updateLogicConf()
      } catch (error) {
        ElMessage.error('请检查逻辑配置是否有误')
        return
      }
      const saveData = buildData(this.$store.state.edit.schema)
      if (!saveData.surveyId) {
        ElMessage.error('未获取到问卷id')
        return
      }
      if (this.isPublishing) {
        return
      }
      
      try {
        this.isPublishing = true
        const saveRes = await saveSurvey(saveData)
        if (saveRes.code !== 200) {
          ElMessage.error(saveRes.errmsg || '问卷保存失败')
          return
        }
        const publishRes = await publishSurvey({ surveyId: this.surveyId })
        if (publishRes.code === 200) {
          ElMessage.success('发布成功')
          this.$store.dispatch('edit/getSchemaFromRemote')
          this.$router.push({
            name: 'publishResultPage'
          })
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
      if(showLogicEngine.value) {
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
