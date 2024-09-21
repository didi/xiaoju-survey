import { type Ref, ref, reactive } from 'vue'
import { merge } from 'lodash-es'

import { getSurveyById, getSessionId } from '@/management/api/survey'
import useLogicEngine from './useLogicEngine'

export default function useInitializeSchema(
  surveyId: Ref<string>,
  initializeSchemaCallBack: () => void
) {
  const schema = reactive({
    metaData: null,
    bannerConf: {
      titleConfig: {
        mainTitle: '<h3 style="text-align: center">欢迎填写问卷</h3>',
        subTitle: `<p>为了给您提供更好的服务，希望您能抽出几分钟时间，将您的感受和建议告诉我们，<span style="color: rgb(204, 0, 0)">期待您的参与！</span></p>`,
        applyTitle: ''
      },
      bannerConfig: {
        bgImage: '',
        bgImageAllowJump: false,
        bgImageJumpLink: '',
        videoLink: '',
        postImg: ''
      }
    },
    bottomConf: {
      logoImage: '',
      logoImageWidth: '28%'
    },
    skinConf: {
      backgroundConf: {
        color: '#fff'
      },
      themeConf: {
        color: '#ffa600'
      },
      contentConf: {
        opacity: 100
      }
    },
    baseConf: {
      begTime: '',
      endTime: '',
      language: 'chinese',
      tLimit: 0,
      answerBegTime: '',
      answerEndTime: '',
      answerLimitTime: 0
    },
    submitConf: {
      submitTitle: '',
      msgContent: {},
      confirmAgain: {
        is_again: true
      },
      link: ''
    },
    questionDataList: [],
    pageEditOne: 1,
    pageConf: [], // 分页逻辑
    logicConf: {
      showLogicConf: [],
      jumpLogicConf: []
    }
  })
  const { showLogicEngine, initShowLogicEngine, jumpLogicEngine, initJumpLogicEngine } =
    useLogicEngine(schema)

  function initSchema({ metaData, codeData }: { metaData: any; codeData: any }) {
    schema.metaData = metaData
    schema.bannerConf = merge({}, schema.bannerConf, codeData.bannerConf)
    schema.bottomConf = merge({}, schema.bottomConf, codeData.bottomConf)
    schema.skinConf = merge({}, schema.skinConf, codeData.skinConf)
    schema.baseConf = merge({}, schema.baseConf, codeData.baseConf)
    schema.submitConf = merge({}, schema.submitConf, codeData.submitConf)
    schema.questionDataList = codeData.questionDataList || []
    schema.logicConf = codeData.logicConf
    schema.pageEditOne = 1
    schema.pageConf = codeData.pageConf
  }

  const sessionId = ref('')
  async function initSessionId() {
    const sessionIdKey = `${surveyId.value}_sessionId`
    const localSessionId = sessionStorage.getItem(sessionIdKey)
    if (localSessionId) {
      sessionId.value = localSessionId
    } else {
      const res: Record<string, any> = await getSessionId({ surveyId: surveyId.value })
      if (res.code === 200) {
        sessionId.value = res.data.sessionId
        sessionStorage.setItem(sessionIdKey, sessionId.value)
      }
    }
  }

  async function getSchemaFromRemote() {
    const res: any = await getSurveyById(surveyId.value)
    if (res.code === 200) {
      const metaData = res.data.surveyMetaRes
      document.title = metaData.title
      const data = res.data.surveyConfRes.code
      const {
        bannerConf,
        bottomConf,
        skinConf,
        baseConf,
        submitConf,
        dataConf,
        logicConf = {}
      } = data
      if (!data.pageConf || data.pageConf.length === 0) {
        data.pageConf = [dataConf.dataList.length]
      }
      initSchema({
        metaData,
        codeData: {
          bannerConf,
          bottomConf,
          skinConf,
          baseConf,
          submitConf,
          questionDataList: dataConf.dataList,
          pageConf: data.pageConf,
          logicConf
        }
      })
      initializeSchemaCallBack()

      initShowLogicEngine()
      initJumpLogicEngine()
    } else {
      throw new Error(res.errmsg || '问卷不存在')
    }
  }

  return {
    schema,
    getSchemaFromRemote,
    showLogicEngine,
    jumpLogicEngine,
    sessionId,
    initSessionId
  }
}
