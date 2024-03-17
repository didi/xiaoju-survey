<template>
  <el-button
    type="primary"
    :loading="isPublishing"
    class="publish-btn"
    @click="onPublish"
  >
    发布
  </el-button>
</template>
<script>
import { mapState } from 'vuex';
import { publishSurvey, saveSurvey } from '@/management/api/survey';
import buildData from './buildData';
import { get as _get } from 'lodash-es';
export default {
  name: 'publish',
  data() {
    return {
      isPublishing: false,
    };
  },
  computed: {
    ...mapState({
      surveyId: (state) => _get(state, 'edit.surveyId'),
    }),
  },
  methods: {
    async onPublish() {
      const saveData = buildData(this.$store.state.edit.schema);
      if (!saveData.surveyId) {
        this.$message.error('未获取到问卷id');
        return;
      }
      if (this.isPublishing) {
        return;
      }
      try {
        this.isPublishing = true;
        const saveRes = await saveSurvey(saveData);
        if (saveRes.code !== 200) {
          this.$message.error(saveRes.errmsg || '问卷保存失败');
          return;
        }
        const publishRes = await publishSurvey({ surveyId: this.surveyId });
        if (publishRes.code === 200) {
          this.$message.success('发布成功');
          this.$store.dispatch('edit/getSchemaFromRemote');
          this.$router.push({
            name: 'publishResultPage',
          });
        } else {
          this.$message.error(`发布失败 ${publishRes.errmsg}`);
        }
      } catch (error) {
        this.$message.error(`发布失败`);
      } finally {
        this.isPublishing = false;
      }
    },
  },
};
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
