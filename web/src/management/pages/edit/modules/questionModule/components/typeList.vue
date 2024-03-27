<template>
  <el-collapse class="question-type-wrapper" v-model="activeNames">
    <el-collapse-item
      v-for="(item, index) of questionMenuConfig"
      :title="item.title"
      :name="index"
      :key="index"
    >
      <draggable
        class="questiontype-list item-wrapper"
        :options="{
          element: 'li',
          sort: false,
          group: { name: 'previewList', pull: 'clone', put: false },
        }"
      >
        <el-popover
          v-for="(item, index) in item.questionList"
          :key="item.type"
          placement="right"
          trigger="hover"
          :popper-class="'qtype-popper-' + (index % 3)"
        >
          <img :src="item.snapshot" width="345px" />
          <div
            slot="reference"
            :key="item.type"
            class="qtopic-item"
            @click="onQuestionType({ type: item.type })"
          >
            <i class="iconfont" :class="['icon-' + item.icon]"></i>
            <p class="text">{{ item.title }}</p>
          </div>
        </el-popover>
      </draggable>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import questionLoader from '@/materials/questions/questionLoader';
import draggable from 'vuedraggable';

import questionMenuConfig, {
  questionTypeList,
} from '@/management/config/questionMenuConfig';
import { getQuestionByType } from '@/management/utils/index';
import { mapState, mapActions } from 'vuex';
import { get as _get } from 'lodash-es';

export default {
  name: 'QuestionTypeList',
  components: {
    draggable,
  },
  data() {
    return {
      activeNames: [0, 1],
      questionMenuConfig,
    };
  },
  computed: {
    ...mapState({
      questionDataList: (state) => _get(state, 'edit.schema.questionDataList'),
      currentEditOne: (state) => _get(state, 'edit.currentEditOne'),
    }),
  },
  async created() {
    await questionLoader.init({
      typeList: questionTypeList.map((item) => item.type),
    });
  },
  methods: {
    ...mapActions({
      addQuestion: 'edit/addQuestion',
    }),
    onQuestionType({ type }) {
      const questionDataList = this.questionDataList || [];
      const fields = questionDataList.map((item) => item.field);
      const currentEditOne = this.currentEditOne;
      const index =
        typeof currentEditOne === 'number'
          ? currentEditOne + 1
          : questionDataList.length;
      const newQuestion = getQuestionByType(type, fields);
      newQuestion.title = newQuestion.title = `标题${index + 1}`;
      if (type === 'vote') {
        newQuestion.innerType = 'radio';
      }
      this.addQuestion({ question: newQuestion, index });
      this.$store.commit('edit/setCurrentEditOne', index);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.question-type-wrapper {
  padding: 0 20px;
  border: none;
  ::v-deep .el-collapse-item__header {
    font-size: 16px;
    font-weight: bold;
    color: #4a4c5b;
  }
}

.questiontype-list {
  // height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  // padding-bottom: 25px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  border-top: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .qtopic-item {
    height: 77px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    border: 1px solid $disable-color;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: $primary-color-light;
      border: 1px solid $primary-color;
    }

    .text {
      font-size: 12px;
    }
  }

  .iconfont::before {
    font-size: 21px;
    color: $font-color-title;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss">
.qtype-popper-0 {
  transform: translateX(183px);
}

.qtype-popper-1 {
  transform: translateX(106px);
}

.qtype-popper-2 {
  transform: translateX(30px);
}
</style>
