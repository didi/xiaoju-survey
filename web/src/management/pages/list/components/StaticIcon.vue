<template>
    <i-ep-sort v-if="props.icon === 'sort'"/>
    <i-ep-sort-up v-if="props.icon === 'sort-up'" />
    <i-ep-sort-down  v-if="props.icon === 'sort-down'"/>
</template>
<script setup>
// unplugin-icons只能处理静态组件，因此将使用的动态icon在这里转成静态组件
// see https://github.com/unplugin/unplugin-icons/issues/5
const props = defineProps({
    icon: {
        type: String,
        required: true
    }
})
</script>