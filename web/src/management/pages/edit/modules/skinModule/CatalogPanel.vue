<template>
  <div class="tab-box">
    <div class="title">主题设置</div>
    <div class="content">
      <div class="tag-list">
        <el-tag
          v-for="item in groupList"
          :class="[groupName === item.value ? 'current' : '', 'tag']"
          type="info"
          :key="item.value"
          @click="() => handleChangeGroup(item.value)"
        >
          {{ item.label }}
        </el-tag>
      </div>
      <div class="banner-list-wrapper">
        <div
          class="single-banner-wrapper"
          v-for="(banner, bannerIndex) in currentBannerList"
          :key="bannerIndex"
        >
          <img class="banner-img" :src="banner.src" loading="lazy" @click="changePreset(banner)" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useEditStore } from '@/management/stores/edit'
import { getBannerData } from '@/management/api/skin.js'
import skinPresets from '@/management/config/skinPresets.js'

const editStore = useEditStore()
const { changeThemePreset } = editStore
const groupName = ref<string>('temp')
let bannerList = ref<string[]>([])

onMounted(async () => {
  const res = await getBannerData()
  bannerList.value = res.data
})

const groupList = computed(() =>
  Object.keys(bannerList.value).map((key) => ({
    label: (bannerList.value as any)[key].name,
    value: key
  }))
)
const currentBannerList = computed(() => {
  const arr = Object.keys(bannerList.value)
    .map((key) => {
      return (bannerList.value as any)[key]
    })
    .map((data) => {
      return data.list.map((item: any) => {
        item.group = data.key
        return item
      })
    })

  const allBanner = arr.reduce((acc, curr) => {
    return acc.concat(curr)
  }, [])

  return allBanner.filter((item: any) => {
    if (groupName.value === 'temp') {
      return true
    } else {
      return item.group === groupName.value
    }
  })
})

const handleChangeGroup = (value: string) => {
  groupName.value = value
}

const changePreset = (banner: any) => {
  const name = banner.group + '-' + banner.title
  let presets = {
    'bannerConf.bannerConfig.bgImage': banner.src,
    'skinConf.themeConf.color': '#faa600',
    'skinConf.backgroundConf.color': '#f6f7f9'
  }

  if ((skinPresets as any)[name]) {
    presets = Object.assign(presets, (skinPresets as any)[name])
  }

  changeThemePreset(presets)
}
</script>
<style lang="scss" scoped>
.tab-box {
  width: 360px;
  height: 100%;
  box-shadow: none;
  border: none;
  overflow-y: auto;
  background-color: #fff;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: $primary-color;
    padding-left: 20px;
    // background: #f9fafc;
    border-bottom: 1px solid #edeffc;
  }
  .content {
    padding: 12px;
  }
  .tag-list {
    display: flex;
    flex-wrap: wrap;
    .tag {
      width: 65px;
      margin: 5px 2px;
      cursor: pointer;
      flex: auto;
      &.current {
        color: $primary-color;
        background-color: $primary-bg-color;
      }
    }
  }
  .banner-list-wrapper {
    padding: 15px 3px 100px 3px;
    overflow-x: hidden;

    .banner-img {
      position: relative;
      margin-bottom: 10px;
      width: 100%;
      // min-height: 111px;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 4px;
      &:hover {
        -webkit-filter: brightness(90%);
        filter: brightness(90%);
      }
    }

    :deep(.el-collapse-item__header) {
      font-size: 16px;
      color: $font-color-title;
      border-bottom: none;
    }

    :deep(.el-collapse-item__arrow.is-active) {
      right: 0;
    }
    :deep(.el-collapse-item__arrow) {
      right: 0;
    }
  }
}
</style>
