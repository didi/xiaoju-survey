<template>
  <el-dialog
    class="base-dialog-root"
    :model-value="visible"
    width="40%"
    title="基础信息"
    @close="onClose"
  >
    <el-form
      class="base-form-root"
      ref="ruleForm"
      :model="current"
      :rules="rules"
      label-position="top"
      size="large"
      @submit.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="current.title" />
      </el-form-item>
      <el-form-item prop="language">
        <el-select v-model="current.language" placeholder="请选择语言">
          <el-option
            v-for="item in languageList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        <template #label>
          <span>语言</span>
          <el-tooltip content="修改语言不会自动修改答卷某些可编辑内容的多语言文本，请谨慎修改">
            <el-icon style="margin-left: 4px;">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </template>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="current.remark" />
      </el-form-item>
      <el-form-item
        prop="groupId"
        label="分组"
        v-if="menuType === MenuType.PersonalGroup && !current.isCollaborated"
      >
        <el-select v-model="current.groupId" placeholder="未分组" clearable>
          <el-option
            v-for="item in groupAllList"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" class="save-btn" @click="onSave">{{
          type === QOP_MAP.EDIT ? '保存' : '确定'
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { pick as _pick } from 'lodash-es'
import { ElMessage } from 'element-plus'
import 'element-plus/theme-chalk/src/message.scss'
import { QuestionFilled } from '@element-plus/icons-vue';


import { CODE_MAP } from '@/management/api/base'
import { updateSurvey, createSurvey } from '@/management/api/survey'
import { QOP_MAP } from '@/management/utils/constant'
import { MenuType, GroupState } from '@/management/utils/workSpace'
import { languageList } from '@/management/constants/language'

export default {
  name: 'ModifyDialog',
  props: {
    type: String,
    questionInfo: Object,
    width: String,
    visible: Boolean,
    groupAllList: Array,
    menuType: String
  },
  components: {
    QuestionFilled
  },
  data() {
    return {
      languageList,
      QOP_MAP,
      MenuType,
      loadingInstance: null,
      rules: {
        title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }],
        language: [{ required: true, message: '请选择语言', trigger: 'change' }],
      },
      current: this.getCurrent(this.questionInfo)
    }
  },
  watch: {
    questionInfo: {
      handler(val) {
        this.current = this.getCurrent(val)
      },
      deep: true
    }
  },
  methods: {
    getCurrent(val) {
      return {
        ..._pick(val, ['title', 'language', 'remark', 'isCollaborated']),
        groupId: val.groupId === null ? '' : val.groupId
      }
    },
    onClose() {
      this.$emit('on-close-codify')
    },
    async onSave() {
      if (this.type === QOP_MAP.COPY) {
        await this.handleCopy()
      } else {
        await this.handleUpdate()
      }

      this.$emit('on-close-codify', 'update')
    },
    async handleUpdate() {
      try {
        const res = await updateSurvey({
          surveyId: this.questionInfo._id,
          ...this.current,
          groupId:
            this.current.groupId === GroupState.All || this.current.groupId === GroupState.Not
              ? ''
              : this.current.groupId
        })

        if (res.code === CODE_MAP.SUCCESS) {
          ElMessage.success('修改成功')
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (err) {
        ElMessage.error(err)
      }
    },
    async handleCopy() {
      try {
        const res = await createSurvey({
          createFrom: this.questionInfo._id,
          createMethod: QOP_MAP.COPY,
          ...this.current
        })

        if (res.code === CODE_MAP.SUCCESS) {
          const { data } = res
          this.$router.push({
            name: 'QuestionEditIndex',
            params: {
              id: data.id
            }
          })
        } else {
          ElMessage.error(res.errmsg)
        }
      } catch (err) {
        ElMessage.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base-form-root {
  padding: 20px;
}
</style>
