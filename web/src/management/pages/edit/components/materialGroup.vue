<script>
import { computed, defineComponent, ref, getCurrentInstance } from 'vue';
import QuestionContainer from '@/materials/questions/widgets/QuestionContainer.jsx';
import questionWrapper from './questionWrapper.vue';
import draggable from 'vuedraggable';
import { filterQuestionPreviewData } from '@/management/utils/index';

export default defineComponent({
  name: '',
  components: { draggable },
  props: {
    currentEditOne: {
      type: [Number, String],
      default: null,
    },
    questionDataList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  watch: {},
  setup(props, { emit }) {
    const renderData = computed(() => {
      return filterQuestionPreviewData(props.questionDataList);
    });
    const handleSelect = (index) => {
      emit('select', index);
    };
    const handleChangeSeq = (data) => {
      emit('changeSeq', data);
    };

    const isMoving = ref(false);

    const checkMove = () => {
      isMoving.value = true;
    };

    const checkEnd = ({ oldIndex, newIndex }) => {
      emit('changeSeq', {
        type: 'move',
        index: oldIndex,
        range: newIndex - oldIndex,
      });
    };

    const instance = getCurrentInstance();

    const getQuestionRefByField = (field) => {
      return instance?.proxy?.$refs[`questionWrapper-${field}`] || null;
    };

    return {
      renderData,
      handleSelect,
      handleChangeSeq,
      checkMove,
      checkEnd,
      dragOptions: {
        animation: 0,
        group: 'previewList',
        handle: '.el-icon-rank',
        scroll: true,
        scrollSpeed: 2500,
        scrollSensitivity: 150,
        forceFallback: true,
      },
      getQuestionRefByField,
    };
  },
  render(h) {
    return (
      <draggable
        list={this.renderData}
        options={this.dragOptions}
        onEnd={this.checkEnd}
        move={this.checkMove}
      >
        {this.renderData.map((item, index) => {
          return h(
            questionWrapper,
            {
              ref: `questionWrapper-${item.field}`,
              key: item.field,
              props: {
                moduleConfig: item,
                qIndex: item.qIndex,
                indexNumber: item.indexNumber,
                isSelected: this.currentEditOne === index,
                isLast: index + 1 === this.questionDataList.length,
              },
              on: {
                ...this.$listeners,
                select: this.handleSelect,
                changeSeq: this.handleChangeSeq,
              },
            },
            [
              h(QuestionContainer, {
                props: {
                  type: item.type,
                  moduleConfig: item,
                  indexNumber: item.indexNumber,
                  isSelected: this.currentEditOne === index,
                  readonly: true,
                },
                on: {
                  ...this.$listeners,
                  select: this.handleSelect,
                },
              }),
            ]
          );
        })}
      </draggable>
    );
  },
});
</script>
