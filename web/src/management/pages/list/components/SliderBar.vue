<template>
  <el-menu
    :default-active="SpaceType.Personal"
    class="el-menu-vertical"
    ref="menuRef"
    @select="handleSelect"
  >
    <template v-for="(menu, index) in menus" :key="menu.id">
      <el-menu-item
        :class="[index === 0 ? 'bottom' : '', index > 2 ? 'sub-item' : 'main-item']"
        :index="menu.id"
        v-if="!menu.children?.length"
      >
        <template #title>
          <div class="title-content">
            <i :class="['iconfont', menu.icon]"></i>
            <span>{{ menu.name }}</span>
          </div>
        </template>
      </el-menu-item>
      <el-menu-item-group v-else>
        <template #title>
          <el-menu-item :index="menu.id" class="sub-title main-item">
            <div class="title-content">
              <i :class="['iconfont', menu.icon]"></i>
              <span>{{ menu.name }}</span>
            </div>
          </el-menu-item>
        </template>
        <el-menu-item v-for="item in menu.children" :key="item.id" :index="item.id">
          <p>
            {{ item.name }}
          </p>
        </el-menu-item>
      </el-menu-item-group>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { type MenuItem } from '@/management/utils/workSpace'
import { SpaceType } from '@/management/utils/workSpace'

const menuRef = ref()

withDefaults(
  defineProps<{
    menus: Array<MenuItem>
  }>(),
  {
    menus: () => []
  }
)
const emit = defineEmits(['select'])
const handleSelect = (id: string) => {
  emit('select', id)
}
</script>

<style lang="scss" scoped>
.el-menu-vertical {
  border: none;
  width: 200px;
  min-height: 400px;
  height: 100%;
  position: absolute;
  top: 1px;
  bottom: 0px;
  z-index: 999;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.04);
  :deep(.el-menu-item) {
    width: 200px;
    height: 36px;
    > p {
      overflow: hidden;
      /*文本不会换行*/
      white-space: nowrap !important;
      /*当文本溢出包含元素时，以省略号表示超出的文本*/
      text-overflow: ellipsis;
    }

    &.bottom {
      border-bottom: 1px solid #f6f5f2;
    }
    &.main-item {
      // margin: 10px 0;
      font-size: 16px;
      font-weight: 500;
      color: #292a36;
      height: 48px;
    }
    &.sub-item {
      margin: 0;
    }
    &.is-active {
      // background-color: #F2F4F7;
      background: #fef6e6 100% !important;
    }
    &:hover {
      background-color: #f2f4f7;
    }
    .title-content {
      display: flex;
      align-items: center;
      font-weight: 400;
    }
  }
  :deep(.el-menu-item-group) {
    > ul {
      > li {
        padding-left: 45px !important;
      }
    }
  }
  :deep(.el-menu-item-group__title) {
    cursor: pointer;
    padding: 0 !important;
  }
  .sub-title {
    width: 100%;
    width: 100%;
  }
}
.iconfont {
  font-size: 16px;
  margin-right: 10px;
  color: #faa600 !important;
}
</style>
