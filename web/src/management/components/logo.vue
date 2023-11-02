<template>
  <div class="navbar-main-logo" @click="toHomePage">
    <img src="/imgs/s-logo.jpg" />
  </div>
</template>
<script>
export default {
  name: 'logoIcon',
  methods: {
    toHomePage() {
      this.$router.push({
        name: 'survey',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.navbar-main-logo {
  width: 80px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    cursor: pointer;
  }

  img {
    width: 32px;
  }
}
</style>
