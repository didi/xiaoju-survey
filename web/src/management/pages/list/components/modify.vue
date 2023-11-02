<template>
  <el-dialog
    class="base-dialog-root"
    :visible="visible"
    width="40%"
    title="基础信息"
    @close="onClose"
  >
    <el-form
      class="base-form-root"
      ref="ruleForm"
      :model="current"
      label-width="80px"
      :rules="rules"
      label-position="top"
      @submit.native.prevent
    >
      <el-form-item label="标题" prop="title">
        <el-input size="medium" v-model="current.title" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input size="medium" v-model="current.remark" />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" class="save-btn" @click="onSave"
        >保存</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { CODE_MAP } from '@/management/api/base';
import { updateSurvey } from '@/management/api/survey';
import _pick from 'lodash/pick';

export default {
  name: 'modifyDialog',
  props: {
    questionInfo: Object,
    width: String,
    visible: Boolean,
  },
  data() {
    return {
      loadingInstance: null,
      rules: {
        title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }],
      },
      current: this.getCurrent(this.questionInfo),
    };
  },
  watch: {
    questionInfo: {
      handler(val) {
        this.current = this.getCurrent(val);
      },
      deep: true,
    },
  },
  methods: {
    getCurrent(val) {
      return {
        ..._pick(val, ['title', 'remark']),
      };
    },
    onClose() {
      this.$emit('on-close-codify');
    },
    async onSave() {
      const res = await updateSurvey({
        surveyId: this.questionInfo._id,
        ...this.current,
      });

      if (res.code === CODE_MAP.SUCCESS) {
        this.$message.success('修改成功');
      } else {
        this.$message.error(res.errmsg);
      }

      this.$emit('on-close-codify', 'update');
    },
  },
};
</script>

<style lang="scss" rel="lang/scss" scoped></style>
