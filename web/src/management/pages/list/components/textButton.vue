<template>
    <div class="text-button-root" @click="onClick">
        <el-button type="text" :icon="currentOption.icon" size="mini">
            <slot>{{ currentOption.label }}</slot>
        </el-button>
    </div>
</template>
<script>
export default{
    name: 'TextButton',
    data(){
        return {
            optionIndex: 0,
            optionValue: ''
        }
    },
    props: {
        options: {
            type: Array,
            required: true
        },
        effectFun: {
            type: Function
        },
        effectKey: {
            type: String
        }
    },
    computed: {
        optionsLength(){
            return this.options.length
        },
        currentOption(){
            return this.options[this.optionIndex % this.optionsLength]
        }
    },
    watch: {
      currentOption(newOption){
        typeof this.effectFun === 'function' && this.effectFun(newOption, this.effectKey)
      }  
    },
    methods: {
        onClick(){
            if(this.optionIndex > this.optionsLength){
                this.optionIndex = 0
                return
            }
            this.optionIndex++
        }
    },
}
</script>
<style lang="scss" scoped>
    .el-button{
        margin-right: 20px;
    }
</style>