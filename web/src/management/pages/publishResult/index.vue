<template>
  <div class="publish-result-page">
    <leftMenu class="left"></leftMenu>
    <div class="right">
      <template v-if="curStatus !== 'new'">
        <div
          class="preview-container"
          :style="{ backgroundImage: `url('${this.phoneBg}')` }"
        >
          <iframe :src="mainChannel.fullUrl"></iframe>
        </div>
        <div class="container-content">
          <span class="launch-tip"
            >说明：若您的问卷投放对象，涉及14周岁以下的用户，需征得其监护人的同意。</span
          >
          <h2>问卷链接</h2>
          <div class="main-channel-wrap">
            <channel-row
              :disable-delete="true"
              :data="mainChannel"
              :style-wrap="{ marginBottom: '8px' }"
            />
          </div>
        </div>
      </template>
      <empty v-else :data="noDataConfig" />
    </div>
  </div>
</template>
<script>
import ChannelRow from './components/channelRow';
import empty from '@/management/components/empty';
import { get as _get } from 'lodash-es';
import leftMenu from '@/management/components/leftMenu.vue';
import { mapState } from 'vuex';

export default {
  name: 'publishResultPage',
  data() {
    return {
      noDataConfig: {
        title: '问卷未发布',
        desc: '点击发布后，问卷就可以对外投放了哦！',
        img: '/imgs/icons/unpublished.webp',
      },
      phoneBg: '/imgs/phone-bg.webp',
    };
  },
  async created() {
    this.$store.commit('edit/setSurveyId', this.$route.params.id);
    try {
      await this.$store.dispatch('edit/init');
    } catch (error) {
      this.$message.error(error.message);
      // 自动跳转回列表页
      setTimeout(() => {
        this.$router.replace({
          name: 'survey',
        });
      }, 1000);
    }
  },
  computed: {
    ...mapState({
      metaData: (state) => _get(state, 'edit.schema.metaData'),
    }),
    curStatus() {
      return _get(this.metaData, 'curStatus.status', 'new');
    },
    mainChannel() {
      if (!this.metaData) {
        return {
          fullUrl: '',
        };
      }
      return {
        fullUrl: `${location.origin}/render/${this.metaData.surveyPath}`,
      };
    },
  },
  components: {
    ChannelRow,
    empty,
    leftMenu,
  },
};
</script>

<style lang="scss" scoped>
.publish-result-page {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .left {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .right {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-left: 80px;
    display: flex;
    align-items: center;
    justify-content: center;

    background: #f6f7f9;
    padding: 30px 40px 50px 40px;
  }

  .preview-container {
    width: 390px;
    height: 769px;
    flex-grow: 0;
    flex-shrink: 0;
    overflow: hidden;
    padding: 117px 38px 67px 38px;
    background-position: 0 0;
    background-size: 100% 100%;

    iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.container-content {
  margin-left: 20px;
  background-color: #fff;
  width: 760px;
  padding: 30px 30px 80px;
  border-radius: 2px;

  .launch-tip {
    font-size: 12px;
    color: #fa881a;
  }

  h2 {
    font-family: PingFangSC-Medium;
    margin: 20px 0;
    font-size: 18px;
    color: #4a4c5b;
    letter-spacing: 0;
    line-height: 26px;
  }
}
</style>
