<template>
  <div class="nav">
    <div class="left-group">
      <back></back>
      <pageTitle :style="{ marginLeft: '30px' }" :title="title"></pageTitle>
    </div>
    <div class="center-group">
      <pageNav></pageNav>
    </div>
    <div class="right-group">
      <history></history>
      <save></save>
      <publish></publish>
    </div>
  </div>
</template>

<script>
import back from '../modules/generalModule/back.vue';
import pageTitle from '../modules/generalModule/pageTitle.vue';
import pageNav from '../modules/generalModule/pageNav.vue';
import history from '../modules/contentModule/history.vue';
import save from '../modules/contentModule/save.vue';
import publish from '../modules/contentModule/publish.vue';
import { mapState } from 'vuex';
import { get as _get } from 'lodash-es';

export default {
  name: 'navbar',
  components: {
    back,
    pageTitle,
    pageNav,
    history,
    save,
    publish,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      title: (state) => _get(state, 'edit.schema.metaData.title'),
    }),
  },
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 56px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .center-group {
    height: 100%;
    flex: 1;
    justify-content: center;
  }
  .left-group,
  .right-group {
    position: absolute;
    top: 0;
    height: 100%;
  }
}

.left-group {
  left: 18px;
}
.right-group {
  right: 18px;
}
</style>
