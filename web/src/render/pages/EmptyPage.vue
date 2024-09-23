<template>
  <div class="container">
    <img src="/imgs/nodata.webp" alt="" class="ui-404" />
    <div class="ui-title">问卷找不到啦~</div>
  </div>
</template>

<script setup></script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20vh;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
}
.ui-404 {
  width: 75%;
  max-width: 300px;
  margin: 0.4rem auto 0;
  display: block;
}
.ui-title {
  margin-top: 0.3rem;
  text-align: center;
  font-size: 0.5rem;
}
.ui-title .ui-subtitle {
  padding-top: 10px;
  font-size: 12px;
  color: #909090;
}
</style>
