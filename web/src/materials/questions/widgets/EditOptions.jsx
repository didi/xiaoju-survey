import { defineComponent, ref, computed, onMounted } from 'vue';
import OptionEdit from '@/materials/questions/components/Options/OptionEdit.vue';
import OptionEditBar from '@/materials/questions/components/Options/OptionEditBar.vue';
import store from '@/management/store';
import questionLoader from '@/materials/questions/questionLoader';
import UseOptionBase from '@/materials/questions/components/Options/UseOptionBase';

export default defineComponent({
  name: 'EditOptions',
  components: {
    OptionEdit,
    OptionEditBar,
  },
  provide() {
    return {
      currentEditKey: store.getters['edit/currentEditKey'],
      moduleConfig: computed(() => this.moduleConfig),
    };
  },
  props: {
    moduleConfig: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const questionDataList = computed(() => {
      return store.state.schema.questionDataList;
    });
    const currentEditOne = computed(() => {
      return store.state?.edit?.currentEditOne;
    });
    const currentEditKey = computed(() => {
      return store.getters['edit/currentEditKey'];
    });
    const getOptions = computed(() => {
      return props.moduleConfig.options;
    });
    const { addOption, addOtherOption } = UseOptionBase(getOptions);
    const handleAddOption = (
      text = '选项',
      others = false,
      index = -1,
      field
    ) => {
      const value = addOption(text, others, index, field);
      handleOptionChange(value);
    };
    const handleAddOtherOption = () => {
      const { field } = props.moduleConfig;
      const value = addOtherOption(field);
      handleOptionChange(value);
    };

    const handleOptionChange = (value) => {
      const optionKey = `options`;
      const key = `${currentEditKey.value}.${optionKey}`;
      handleChange({ key, value });
    };

    const handleChange = ({ key, value }) => {
      store.dispatch('edit/changeSchema', { key, value });
    };
    // const questionMeta = ref({})
    const isShowOptionConfig = ref(false);
    const hasAdvancedConfig = ref(false);
    const hasAdvancedRateConfig = ref(false);
    const showOthers = ref(false);
    const showOptionEdit = ref(false);
    const showOptionEditBar = ref(true);
    onMounted(() => {
      const questionMeta = questionLoader.getMeta(props.moduleConfig.type);
      const { editConfigure } = questionMeta;

      if (editConfigure) {
        showOptionEdit.value = editConfigure.optionEdit.show;
        const { optionEditBar } = editConfigure;
        showOptionEditBar.value = optionEditBar.show;
        showOthers.value = optionEditBar.configure.showOthers;
        hasAdvancedConfig.value = Boolean(
          optionEditBar.configure.showAdvancedConfig
        );
        hasAdvancedRateConfig.value = Boolean(
          optionEditBar.configure.showAdvancedRateConfig
        );
      } else {
        // meta不存在的兜底程序
        if (
          ['radio-star', 'text', 'textarea'].includes(props.moduleConfig.type)
        ) {
          showOptionEdit.value = false;
        } else {
          showOptionEdit.value = true;
        }
        if (['radio-star'].includes(props.moduleConfig.type)) {
          showOthers.value = false;
        } else {
          showOthers.value = true;
        }
        if (['binary-choice'].includes(props.moduleConfig.type)) {
          showOptionEditBar.value = false;
        }
        if (!['radio-star'].includes(props.moduleConfig.type)) {
          hasAdvancedConfig.value = true;
        } else {
          hasAdvancedRateConfig.value = true;
        }
      }
    });
    return {
      questionDataList,
      currentEditOne,
      currentEditKey,
      getOptions,
      isShowOptionConfig,
      hasAdvancedConfig,
      hasAdvancedRateConfig,
      showOptionEdit,
      showOptionEditBar,
      showOthers,
      handleAddOption,
      handleAddOtherOption,
      handleOptionChange,
      handleChange,
    };
  },
  render() {
    return (
      <div class="selected-wrapper radio-selected-wrapper">
        {this.showOptionEdit ? (
          <OptionEdit
            option-list={this.getOptions}
            onAddOption={this.handleAddOption}
            onOptionChange={this.handleOptionChange}
            onChange={this.handleChange}
          />
        ) : (
          this.$slots.default()
        )}
        {this.showOptionEditBar && (
          <OptionEditBar
            ref="optionEditBar"
            option-list={this.getOptions}
            showOthers={this.showOthers}
            hasAdvancedConfig={this.hasAdvancedConfig}
            hasAdvancedRateConfig={this.hasAdvancedRateConfig}
            onAddOption={this.handleAddOption}
            onAddOther={this.handleAddOtherOption}
            onOptionChange={this.handleOptionChange}
            onChange={this.handleChange}
          />
        )}
      </div>
    );
  },
});
