<template>
  <div class="btn" @click="onSave" v-loading="isSaving">
    <i class="iconfont icon-baocun"></i>
    <span class="btn-txt">保存</span>
    <transition name="fade">
      <div class="auto-save-wrapper" v-if="isShowAutoSave">
        <span class="sv-text">
          {{ saveText }}
        </span>
        <i class="icon el-icon-loading" v-if="autoSaveStatus === 'saving'"></i>
        <i
          class="icon succeed el-icon-check"
          v-else-if="autoSaveStatus === 'succeed'"
        ></i>
      </div>
    </transition>
  </div>
</template>
<script>
import { saveSurvey } from '@/management/api/survey';
import buildData from './buildData';
import { mapState } from 'vuex';
import { get as _get } from 'lodash-es';

export default {
  name: 'save',
  data() {
    return {
      isSaving: false,
      isShowAutoSave: false,
      autoSaveStatus: 'succeed',
    };
  },
  computed: {
    ...mapState({
      schemaUpdateTime: (state) => _get(state, 'edit.schemaUpdateTime'),
    }),
    saveText() {
      const statusMap = {
        saving: '保存中',
        succeed: '保存成功',
        failed: '保存失败',
      };
      return statusMap[this.autoSaveStatus];
    },
  },
  watch: {
    schemaUpdateTime() {
      this.triggerAutoSave();
    },
  },
  methods: {
    triggerAutoSave() {
      if (this.autoSaveStatus === 'saving') {
        // 正在调用接口
        setTimeout(() => {
          this.triggerAutoSave();
        }, 1000);
      } else {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.autoSaveStatus = 'saving';
          this.isShowAutoSave = true;
          this.$nextTick(() => {
            this.saveData()
              .then((res) => {
                if (res.code === 200) {
                  this.autoSaveStatus = 'succeed';
                } else {
                  this.autoSaveStatus = 'failed';
                }
                setTimeout(() => {
                  this.isShowAutoSave = false;
                  this.timer = null;
                }, 300);
              })
              .catch(() => {
                this.timer = null;
                this.autoSaveStatus = 'failed';
                this.isShowAutoSave = true;
              });
          });
        }, 2000);
      }
    },
    async saveData() {
      const saveData = buildData(this.$store.state.edit.schema);
      if (!saveData.surveyId) {
        this.$message.error('未获取到问卷id');
        return null;
      }
      const res = await saveSurvey(saveData);
      return res;
    },
    async onSave() {
      if (this.isSaving) {
        return;
      }
      this.isShowAutoSave = false;
      try {
        this.isSaving = true;
        const res = await this.saveData();
        if (res.code === 200) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.errmsg);
        }
      } catch (error) {
        this.$message.error('保存问卷失败');
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import url('@/management/styles/edit-btn.scss');

.auto-save-wrapper {
  position: fixed;
  top: 13px;
  right: 280px;
  width: 90px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  opacity: 1;

  .sv-text {
    vertical-align: middle;
    height: 30px;
    line-height: 30px;
    color: #666;
    font-size: 12px;
    margin-right: 6px;
  }

  .icon {
    font-size: 14px;

    &.succeed {
      animation: move 0.6s linear forwards;
      color: green;
    }
  }
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-active {
  transition: all 0.5s 2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes move {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 100%;
  }
}
</style>
