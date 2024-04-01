<script>
import OptionConfig from '@/materials/questions/components/AdvancedConfig/OptionConfig.vue';
import RateConfig from '../AdvancedConfig/RateConfig.vue';
import { defineComponent, ref, computed, inject } from 'vue';
import ExtraIcon from '@/materials/questions/components/ExtraIcon.vue';

export default defineComponent({
  name: 'optionEditBar',
  components: { OptionConfig, ExtraIcon, RateConfig },
  props: {
    optionList: {
      type: Array,
      default: () => [],
    },
    showOthers: {
      type: Boolean,
      default: true,
    },
    hasAdvancedConfig: {
      type: Boolean,
      default: true,
    },
    hasAdvancedRateConfig: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const moduleConfig = inject('moduleConfig');
    const optionConfigVisible = ref(false);

    const addOther = () => {
      emit('addOther');
    };
    const openOptionConfig = () => {
      optionConfigVisible.value = true;
    };
    const handleOptionChange = (value) => {
      emit('optionChange', value);
    };
    const handleChange = (data) => {
      emit('change', data);
    };
    const rateConfigVisible = ref(false);
    const openRateConfig = () => {
      rateConfigVisible.value = true;
    };

    const isNps = computed(() => {
      return moduleConfig.value.type === 'radio-nps';
    });

    const min = computed(() => {
      const { min, starMin } = moduleConfig.value;
      return isNps.value ? min : starMin;
    });

    const max = computed(() => {
      const { max, starMax } = moduleConfig.value;
      return isNps.value ? max : starMax;
    });

    const explain = computed(() => {
      const { type } = moduleConfig.value;
      if (type == 'radio-start') return true;
      if (isNps.value) return false;
      return true;
    });

    return {
      addOther,
      optionConfigVisible,
      openOptionConfig,
      openRateConfig,
      handleOptionChange,
      handleChange,
      moduleConfig,
      rateConfigVisible,
      min,
      max,
      isNps,
      explain,
    };
  },
  render() {
    const {
      showOthers,
      hasAdvancedConfig,
      hasAdvancedRateConfig,
      min,
      max,
      explain,
      isNps,
    } = this;
    return (
      <div class="option-edit-bar-wrap">
        <div class="option-edit-bar">
          {showOthers && (
            <div class="add-option primary-color" onClick={this.addOther}>
              <extra-icon type="add-square"></extra-icon>
              其他____
            </div>
          )}
          {hasAdvancedConfig && (
            <span
              class="option-advanced-config primary-color"
              onClick={this.openOptionConfig}
            >
              {'高级设置>'}
            </span>
          )}
          {hasAdvancedRateConfig && (
            <span
              class="option-advanced-config primary-color"
              onClick={this.openRateConfig}
            >
              {'高级评分设置>'}
            </span>
          )}
        </div>
        {this.optionConfigVisible && (
          <OptionConfig
            options={this.optionList}
            show-option-dialog={this.optionConfigVisible}
            show-others={this.showOthers}
            show-limit={false}
            onVisibleChange={(val) => {
              this.optionConfigVisible = val;
            }}
            onAddOther={this.addOther}
            onOptionChange={this.handleOptionChange}
            onChange={this.handleChange}
          />
        )}
        {this.rateConfigVisible && (
          <RateConfig
            min={min}
            max={max}
            rangeConfig={this.moduleConfig.rangeConfig}
            visible={this.rateConfigVisible}
            onVisibleChange={(val) => {
              this.rateConfigVisible = val;
            }}
            explain={explain}
            dialogWidth="800px"
            onConfirm={this.handleChange}
            class={[isNps ? 'nps-rate-config' : '']}
          />
        )}
      </div>
    );
  },
});
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// @import '../../common/css/default.scss';

.option-edit-bar-wrap {
  margin-top: 20px;
  padding-left: 10px;
  position: relative;
  line-height: 24px;
  font-size: 12px;
  color: $primary-color;

  .add-option {
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    font-size: 12px;
  }

  .option-advanced-config {
    color: #0f8a82;
    float: right;
    cursor: pointer;
    font-size: 12px;
  }

  .primary-color {
    color: $primary-color;
  }
}

.nps-rate-config {
  ::v-deep .row {
    height: 47px;
  }
  ::v-deep .text {
    input {
      height: 32px;
    }
  }
}

.pop-title {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #4a4c5b;
  letter-spacing: 0;
  text-align: left;
}

.pop-tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999999;
  letter-spacing: 0.65px;
  text-align: left;
}

.pop-input {
  margin-top: 6px;
  margin-bottom: 16px;
}
</style>
