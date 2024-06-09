<template>
<div class = "quota-wrapper">
    <span class="quota-title">选项配额</span>
    <span
        class="quota-config"
        @click="openQuotaConfig"
    >
        设置>
    </span>

    <el-dialog v-model="dialogTableVisible" @closed="cleanTempQuota" class="dialog">
        <template #header>
            <div class="dialog-title">选项配额</div>
        </template>
        <el-table 
            :header-cell-style="{background:'#F6F7F9',color:'#6E707C'}" 
            :data="optionData" 
            border 
            style="width: 100%;"
            @cell-click="handleCellClick">
            <el-table-column property="text" label="选项"  style="width: 50%;"></el-table-column>
            <el-table-column property="quota" style="width: 50%;">
                <template #header>
                    <div style="display: flex; align-items: center">
                        <span>配额设置</span>
                        <el-tooltip class="tooltip" effect="dark" placement="right" content="类似商品库存，表示最多可以被选择多少次；0为无限制；已发布问卷，上限修改时数量不可减小。">
                            <i-ep-questionFilled class="icon-tip" />
                        </el-tooltip>
                    </div>
                </template>
                <template class="item" v-slot="scope">
                    <el-input 
                        v-if="scope.row.isEditing"
                        v-model="scope.row.tempQuota"
                        type="number"
                        @blur="handleInput(scope.row)"
                        placeholder="请输入">
                    </el-input>
                    <div v-else class="item__txt">
                        <span v-if="scope.row.tempQuota !== '0'">{{scope.row.tempQuota}}</span>
                        <span v-else style="color: #C8C9CD;">请输入</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div>

        </div>
        <div>
            <el-checkbox
                v-model="deleteRecoverValue"
                label="删除后恢复选项配额"
            >
            </el-checkbox>
            <el-tooltip class="tooltip" effect="dark" placement="right" content="勾选后，把收集到的数据项删除或者设置为无效回收即可恢复选项配额。">
                <i-ep-questionFilled class="icon-tip" />
            </el-tooltip>
        </div>
        <div>
            <el-checkbox
                v-model="noDisplayValue"
                label="不展示配额剩余数量"
            >
            </el-checkbox>
            <el-tooltip class="tooltip" effect="dark" placement="right" content="勾选后，将不对用户展示剩余配额数量。">
                <i-ep-questionFilled class="icon-tip" />
            </el-tooltip>
        </div>
        
        <el-divider />
        <template #footer>
            <div class="diaglog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button @click="confirm" type="primary">确定</el-button>
            </div>
        </template>
    </el-dialog>
</div>

</template>

<script setup>
import { ref, watch } from 'vue';
import { FORM_CHANGE_EVENT_KEY } from '@/materials/setters/constant'
import { ElMessageBox } from 'element-plus'

const props = defineProps(['formConfig', 'moduleConfig'])
const emit = defineEmits(['form-change'])

const dialogTableVisible = ref(false)
const moduleConfig = ref(props.moduleConfig)
const optionData = ref(props.moduleConfig.options)
const deleteRecoverValue = ref(moduleConfig.deleteRecover)
const noDisplayValue = ref(moduleConfig.noDisplay)

const openQuotaConfig = () =>{
    optionData.value.forEach(item=>{
        item.tempQuota = item.quota
    })
    dialogTableVisible.value = true
}
const cancel = () =>{
    dialogTableVisible.value = false
}
const confirm = () =>{
    handleDeleteRecoverChange()
    handleNoDisplayChange()
    handleQuotaChange()
    dialogTableVisible.value = false
}
const handleCellClick = (row, column, cell, event) =>{
    if(column.property === 'quota'){
        optionData.value.forEach(r => {
            if (r !== row) r.isEditing = false;
        });
        row.tempQuota = row.tempQuota === '0'? row.quota : row.tempQuota
        row.isEditing = true
    }
}
const handleInput = (row) => {
    if(row.tempQuota !== "0" && +row.tempQuota < +row.quota){
        ElMessageBox.alert('配额数不可减少!', '警告', {
            confirmButtonText: '确定',
        })
        row.tempQuota = row.quota
    }
    row.isEditing = false
}

const handleDeleteRecoverChange = () =>{
    const key = "deleteRecover"
    const value = deleteRecoverValue.value
    emit(FORM_CHANGE_EVENT_KEY, { key, value })
}

const handleNoDisplayChange = () =>{
    const key = "noDisplay"
    const value = noDisplayValue.value
    emit(FORM_CHANGE_EVENT_KEY, { key, value })
}
const handleQuotaChange = () =>{
    optionData.value.forEach(item=>{
        item.quota = item.tempQuota
        delete(item.tempQuota)
    })
}
const cleanTempQuota = () =>{
    optionData.value.forEach(item=>{
        delete(item.tempQuota)
    })
}
watch(
  () => props.moduleConfig,
  (val) => {
    moduleConfig.value = val
    optionData.value = val.options
    deleteRecoverValue.value = val.deleteRecover
    noDisplayValue.value = val.noDisplay
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
  .quota-wrapper{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .quota-title{
    font-size: 14px;
    color: #606266;
    margin-bottom: 20px;
    font-weight: bold;
    align-items: center;
  }
  .quota-config {
    color: #ffa600;
    cursor: pointer;
    font-size: 14px;
  }
  .dialog{
    width: 41vw;
    .dialog-title{
        color: #292A36;
        font-size: 20px;
    }
  }
</style>