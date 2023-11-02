<template>
  <div class="not-found">
    <h1>404</h1>
    <p>问卷找不到啦～</p>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 20vh;
  font-family: 'Arial', sans-serif;
}

h1 {
  font-size: 5rem;
  color: #ff5722;
  margin: 0;
}

p {
  font-size: 1.5rem;
  color: #555;
  margin: 10px 0;
}
</style>
