<template>
  <el-menu
    :default-active="SpaceType.Personal"
    class="el-menu-vertical"
    ref="menuRef"
    @select="handleSelect"
  >
    <template v-for="(menu) in menus" :key="menu.id">
      <el-menu-item :index="menu.id" v-if="!menu.children?.length">
        <template #title >
          <component :is="menu.icon" />
          <span>{{ menu.name  }}</span>
        </template>
      </el-menu-item>
      <!-- <el-sub-menu :index="menu.id" v-else> -->
        <el-menu-item-group v-else>
          <template #title >
            <el-menu-item :index="menu.id" class="sub-title"> 
              <component :is="menu.icon" />
              <span>{{ menu.name  }}</span>
            </el-menu-item>
          </template>
          <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.id">{{ item.name }}</el-menu-item>
        </el-menu-item-group>
      <!-- </el-sub-menu> -->
    </template>
  </el-menu>
</template>
<script setup lang="ts" >
import { ref } from 'vue'
import { type MenuItem } from '@/management/utils/types/workSpace'
import { SpaceType } from '@/management/utils/types/workSpace'

const menuRef = ref()

withDefaults(defineProps<{
  menus: Array<MenuItem>,
}>(), {
  menus: () => []
})
const emit = defineEmits(['change', 'groupClick'])
const handleSelect = (id: string) => {
  emit('change', id)
}
</script>

<style lang="scss">
.el-menu-vertical {
  &:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: calc(100% - 56px);
    position: absolute;
    top: 1px;
    bottom: 0px;
    z-index: 999;
    overflow-x: hidden;
    overflow-y: auto;
    li {
      width: 200px;
    }
  }
  .el-menu-item-group{
    > ul {
      // padding:  0 30px;
      > li {
        padding-left: 50px!important;
      }
    }
  }
  .el-menu-item-group__title{
    cursor: pointer;
    font-size: 14px;
    color: var(--el-menu-text-color);
    padding: 0!important;
  }
  .sub-title{
    width: 100%;
    width: 100%;
  }
}
</style>
