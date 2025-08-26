<template>
  <el-menu
    :default-active="activeValue"
    class="el-menu-vertical"
    ref="menuRef"
    @select="handleMenu"
    :default-openeds="[MenuType.PersonalGroup, MenuType.SpaceGroup]"
  >
    <template v-for="(menu, index) in props.menus" :key="menu.id">
      <el-menu-item
        :class="[
          'recycle-bin-item',
          menu.id === MenuType.RecycleBin ? 'bottom-element' : '',
          activeValue == menu.id ? 'check-item' : ''
        ]"
        :index="menu.id.toString()"
        v-if="menu.id === MenuType.RecycleBin"
      >
        <template #title>
          <div class="title-box">
            <div class="title-content">
              <i :class="['iconfont', menu.icon]"></i>
              <span>{{ menu.name }}</span>
            </div>
            <p class="title-total" v-if="menu.id === MenuType.RecycleBin">{{ menu.count }}</p>
          </div>
        </template>
      </el-menu-item>


      <div v-else> 
        <el-menu-item
        :class="[
          index === 0 ? 'bottom' : '',
          index > 2 ? 'sub-item' : 'main-item',
          menu.id === MenuType.RecycleBin ? 'bottom-element' : '',
          activeValue == menu.id ? 'check-item' : ''
        ]"
        :index="menu.id.toString()"
        v-if="!menu.children?.length"
      >
        <template #title>
          <div class="title-content">
            <i :class="['iconfont', menu.icon]"></i>
            <span>{{ menu.name }}</span>
          </div>
        </template>
      </el-menu-item>
      </div>
      <el-sub-menu
        v-else
        :index="menu.id.toString()"
        :class="[activeValue == menu.id ? 'check-item' : '']"
        default-opened
      >
        <template #title>
          <div class="title-content sub-title main-item" @click.stop="handleMenu(menu.id)">
            <i :class="['iconfont', menu.icon]"></i>
            <span>{{ menu.name }}</span>
          </div>
        </template>
        <el-menu-item
          v-for="item in menu.children"
          :key="item.id"
          :index="item.id.toString()"
          :class="[activeValue == item.id ? 'check-item' : '']"
        >
          <div class="title-box">
            <p class="title-text">{{ item.name }}</p>
            <p class="title-total">{{ item.total }}</p>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { type MenuItem } from '@/management/utils/workSpace'
import { MenuType } from '@/management/utils/workSpace'
const menuRef = ref()
const props = withDefaults(
  defineProps<{
    menus: Array<MenuItem>
    activeValue: string
  }>(),
  {
    menus: () => [],
    activeValue: MenuType.PersonalGroup
  }
)

const emit = defineEmits(['select'])
const handleMenu = (id: string) => {
  console.log(`handleMenu ${id}`)
  emit('select', id)
}
</script>

<style lang="scss" scoped>
.el-sub-menu {
  :deep(.el-sub-menu__icon-arrow) {
    transform: rotate(-90deg) !important;
  }

  &.is-opened {
    > :deep(.el-sub-menu__title .el-sub-menu__icon-arrow) {
      transform: rotate(0deg) !important;
    }
  }
}
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
    &.bottom-element {
      position: absolute;
      bottom: 0;
      border-top: 1px solid #f6f5f2;
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
    &:hover {
      background-color: #f2f4f7;
    }
    .title-content {
      display: flex;
      align-items: center;
      font-weight: 400;
    }

    .title-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .title-text {
      width: 80%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title-total {
      font-size: 14px;
      color: #92949d;
      text-align: right;
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
.check-item {
  background: #fef6e6 100% !important;
}
.recycle-bin-item {
  height: 56px!important;
}
</style>
