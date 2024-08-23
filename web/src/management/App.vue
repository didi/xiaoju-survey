<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import url('./styles/icon.scss');
@import url('../materials/questions/common/css/icon.scss');
@import url('./styles/reset.scss');
@import url('./styles/common.scss');

html {
  font-size: 50px;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  // font-size: 14px;
}

*,
a:hover * {
  text-decoration: none;
}
</style>
