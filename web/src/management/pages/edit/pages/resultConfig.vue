<template>
    <CommonTemplate>
        <template #left>
            <ResultCatalog />
        </template>
        <template #center>
            <ResultPreview />
        </template>
        <template #right>
            <ResultSetter />
        </template>
    </CommonTemplate>
</template>
<script>
import CommonTemplate from '../components/commonTemplate.vue';
import ResultCatalog from '../modules/settingModule/resultCatalog.vue';
import ResultPreview from '../modules/settingModule/resultPreview.vue';
import ResultSetter from '../modules/settingModule/resultSetter.vue';

export default {
    name: 'editIndex',
    components: {
        CommonTemplate,
        ResultCatalog,
        ResultPreview,
        ResultSetter,
    },
};
</script>
<style lang="scss" scoped></style>
