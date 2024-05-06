<template>
  <div class="index">
    <progressBar />
    <div class="wrapper" ref="box">
      <HeaderSetter></HeaderSetter>
      <div class="content">
        <MainTitle></MainTitle>
        <MainRenderer ref="main"></MainRenderer>
        <submit :validate="validate" :renderData="renderData" @submit="onSubmit"></submit>
        <LogoIcon />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderSetter from '../components/HeaderSetter.vue'
import MainTitle from '../components/MainTitle.vue'
import submit from '../components/SubmitSetter.vue'
import MainRenderer from '../components/MainRenderer.vue'
import AlertDialog from '../components/AlertDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import progressBar from '../components/ProgressBar.vue'
import LogoIcon from '../components/LogoIcon.vue'

import { submitForm } from '../api/survey'
import encrypt from '../utils/encrypt'

import useCommandComponent from '../hooks/useCommandComponent'
import { cloneDeep } from 'lodash-es'

export default {
  name: 'indexPage',
  props: {
    questionInfo: {
      type: Object,
      default: () => ({})
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  components: {
    HeaderSetter,
    MainTitle,
    submit,
    MainRenderer,
    progressBar,
    LogoIcon
  },
  computed: {
    formValues() {
      // 提交给后端的数据需要通过显示逻辑的规则引擎过滤
      return this.$store.state.formValues
    },
    confirmAgain() {
      return this.$store.state.submitConf.confirmAgain
    },
    surveyPath() {
      return this.$store.state.surveyPath
    },
    renderData() {
      return this.$store.getters.renderData
    },
    encryptInfo() {
      return this.$store.state.encryptInfo
    }
  },
  created() {
    this.alert = useCommandComponent(AlertDialog)
    this.confirm = useCommandComponent(ConfirmDialog)
  },
  methods: {
    validate(cbk) {
      const index = 0
      this.$refs.main.$refs.formGroup[index].validate(cbk)
    },
    onSubmit() {
      const { again_text, is_again } = this.confirmAgain
      if (is_again) {
        this.confirm({
          title: again_text,
          onConfirm: async () => {
            try {
              await this.submitForm()
            } catch (error) {
              console.error(error)
            } finally {
              this.confirm.close()
            }
          }
        })
      } else {
        this.submitForm()
      }
    },
    getSubmitData() {
      const formValues = cloneDeep(this.$store.state.formValues)
      const formModel = Object.keys(formValues)
        .filter(key => {
          const match = store.state.ruleEngine.getResult(key, 'question')
          console.log(key, match)
          return match
        })
        .reduce((obj, key) => {
          obj[key] = formValues[key];
          return obj;
        }, {});

      const result = {
        surveyPath: this.surveyPath,
        data: JSON.stringify(formModel),
        difTime: Date.now() - this.$store.state.enterTime,
        clientTime: Date.now()
      }
      if (this.encryptInfo?.encryptType) {
        result.encryptType = this.encryptInfo?.encryptType
        result.data = encrypt[result.encryptType]({
          data: result.data,
          secretKey: this.encryptInfo?.data?.secretKey
        })
        if (this.encryptInfo?.data?.sessionId) {
          result.sessionId = this.encryptInfo.data.sessionId
        }
      } else {
        result.data = JSON.stringify(result.data)
      }

      return result
    },
    async submitForm() {
      try {
        debugger
        const submitData = this.getSubmitData()
        
        const res = await submitForm(submitData)
        if (res.code === 200) {
          this.$store.commit('setRouter', 'successPage')
        } else {
          this.alert({
            title: res.errmsg || '提交失败'
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.index {
  // padding-bottom: 0.8rem;
  min-height: 100%;
  .wrapper {
    min-height: 100%;
    background-color: var(--primary-background-color);
    display: flex;
    flex-direction: column;
    .content {
      flex: 1;
      margin: 0 0.3rem;
      background: rgba(255, 255, 255, var(--opacity));
      border-radius: 8px 8px 0 0;
      height: 100%;
    }
  }
}
</style>
