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
      <el-button type="primary" class="save-btn" @click="onSave">{{
        type === QOP_MAP.EDIT ? '保存' : '确定'
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { CODE_MAP } from '@/management/api/base';
import { updateSurvey, createSurvey } from '@/management/api/survey';
import { pick as _pick } from 'lodash-es';
import { QOP_MAP } from '@/management/utils/constant';

export default {
  name: 'modifyDialog',
  props: {
    type: String,
    questionInfo: Object,
    width: String,
    visible: Boolean,
  },
  data() {
    return {
      QOP_MAP,
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
      if (this.type === QOP_MAP.COPY) {
        await this.handleCopy();
      } else {
        await this.handleUpdate();
      }

      this.$emit('on-close-codify', 'update');
    },
    async handleUpdate() {
      try {
        const res = await updateSurvey({
          surveyId: this.questionInfo._id,
          ...this.current,
        });

        if (res.code === CODE_MAP.SUCCESS) {
          this.$message.success('修改成功');
        } else {
          this.$message.error(res.errmsg);
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
    async handleCopy() {
      try {
        const res = await createSurvey({
          createFrom: this.questionInfo._id,
          createMethod: QOP_MAP.COPY,
          ...this.current,
        });

        if (res.code === CODE_MAP.SUCCESS) {
          const { data } = res;
          this.$router.push({
            name: 'QuestionEditIndex',
            params: {
              id: data.id,
            },
          });
        } else {
          this.$message.error(res.errmsg);
        }
      } catch (err) {
        this.$message.error(err);
      }
    },
  },
};
</script>

<style lang="scss" rel="lang/scss" scoped></style>
