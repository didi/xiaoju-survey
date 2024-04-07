<template>
  <form class="question-form" @submit="submit">
    <slot></slot>
  </form>
</template>
<script>
export default {
  name: 'Form',
  componentName: 'Form',
  provide() {
    return {
      Form: this,
    };
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
    rules: Object,
  },
  computed: {},
  components: {},
  data() {
    return {
      fields: [],
    };
  },
  created() {
    // TODO:vue3移除$on api，需要抽离数据到全局
    // this.$on('form.addField', (field) => {
    //   if (field) {
    //     this.fields.push(field);
    //   }
    // });

    // this.$on('form.removeField', (field) => {
    //   if (field) {
    //     this.fields.splice(this.fields.indexOf(field), 1);
    //   }
    // });
  },
  methods: {
    submit(e) {
      e.preventDefault();
    },
    validate(callback) {
      const length = this.fields.length;
      if (length === 0) {
        callback(true);
      }

      let valid = true;
      let count = 0;
      let flag = false; // 滚动到第一个未验证成功的元素

      this.fields.forEach((field) => {
        field.validate('', (errors) => {
          count++;
          if (errors) {
            if (!flag) {
              flag = true;
              try {
                const el = field.$el;
                el.scrollIntoViewIfNeeded();
              } catch (e) {
                console.error(e);
              }
            }
            valid = false;
          }
          if (typeof callback === 'function' && count === length) {
            callback(valid);
          }
        });
      });
    },
  },
};
</script>
<style></style>
