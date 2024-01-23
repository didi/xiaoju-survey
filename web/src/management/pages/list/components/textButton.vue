<template>
    <div class="text-button-root" @click="onClick">
        <el-button 
            v-bind="{...$attrs}"
            :icon="currentIconItem.name" 
        >
            <slot>{{ option.label }}</slot>
        </el-button>
    </div>
</template>
<script>
export default{
    name: 'TextButton',
    data(){
        return {
            iconIndex: 0
        }
    },
    props: {
        option: {
            type: Object,
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
        iconsLength(){
            return this.option.icons.length
        },
        currentIconItem(){
            let finalIconIndex = this.iconIndex % this.iconsLength
            return this.option.icons[finalIconIndex]
        }
    },
    watch: {
        iconIndex(){
            typeof this.effectFun === 'function' && this.effectFun(this.currentIconItem.effectValue, this.effectKey)
        }  
    },
    methods: {
        onClick(){
            if(this.iconIndex > this.iconsLength){
                this.iconIndex = 0
                return
            }
            this.iconIndex++
        }
    },
}
</script>
<style lang="scss" scoped>
    .el-button{
        margin-right: 20px;
    }
</style>