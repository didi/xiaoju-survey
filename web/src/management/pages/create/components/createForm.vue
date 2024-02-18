<template>
  <div class="right-side">
    <p class="type-title">{{ title }}</p>
    <el-form
      class="new-form"
      label-position="right"
      ref="ruleForm"
      :model="form"
      label-width="100px"
      :rules="rules"
      @submit.native.prevent
    >
      <el-form-item prop="title" label="问卷名称">
        <el-input
          v-model="form.title"
          :class="form.title ? 'nonempty' : 'empty'"
          size="small"
          placeholder="请输入问卷名称"
        />
        <p class="form-item-tip">该标题可在打开问卷的浏览器顶部展示</p>
      </el-form-item>
      <el-form-item prop="remark" label="问卷备注">
        <el-input
          size="small"
          v-model="form.remark"
          :class="form.remark ? 'nonempty' : 'empty'"
          placeholder="请输入备注"
        />
        <p class="form-item-tip">备注仅自己可见</p>
      </el-form-item>
      <el-form-item>
        <el-button
          class="create-btn"
          type="primary"
          size="small"
          @click="submit"
          :loading="!canSubmit"
        >
          开始创建
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { SURVEY_TYPE_LIST } from '../types';
import { createSurvey } from '@/management/api/survey';

export default {
  name: 'CreateForm',
  props: {
    selectType: {
      type: String,
      default: 'normal',
    },
  },
  data() {
    return {
      rules: {
        title: [{ required: true, message: '请输入问卷标题', trigger: 'blur' }],
      },
      canSubmit: true,
      form: {
        title: '问卷调研',
        remark: '问卷调研',
      },
    };
  },
  computed: {
    SURVEY_TYPE_LIST() {
      return SURVEY_TYPE_LIST;
    },
    title() {
      return this.SURVEY_TYPE_LIST.find((item) => item.type === this.selectType)
        ?.title;
    },
  },
  methods: {
    checkForm(fn) {
      this.$refs.ruleForm.validate((valid) => {
        valid && typeof fn === 'function' && fn();
      });
    },
    submit() {
      if (!this.canSubmit) {
        return;
      }
      this.checkForm(async () => {
        const { selectType } = this;
        if (!this.canSubmit) {
          return;
        }
        this.canSubmit = false;
        const res = await createSurvey({
          surveyType: selectType,
          ...this.form,
        });
        if (res.code === 200 && res?.data?.id) {
          const id = res.data.id;
          this.$router.push({
            name: 'QuestionEditIndex',
            params: {
              id,
            },
          });
        } else {
          this.$message.error(res.errmsg || '创建失败');
        }

        this.canSubmit = true;
      });
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.right-side {
  width: 538px;
  margin: auto;
  padding-left: 24px;
  height: 100%;
  position: relative;
  flex-shrink: 0;

  .type-title {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: $font-color-title;
    letter-spacing: 0;
    margin-top: 104px;
    margin-bottom: 30px;
  }
}

.new-form {
  position: relative;
  right: 20px;

  .el-button.el-button--small {
    height: 32px;
    margin-right: 10px;
    border: unset;
    color: white;

    :deep(span) {
      font-size: 14px;
    }
  }

  .create-btn {
    background-color: rgb(255, 166, 0);
    margin-right: 10px;
  }
}

.form-item-tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgb(146, 148, 157);
  letter-spacing: 0;
}
</style>
