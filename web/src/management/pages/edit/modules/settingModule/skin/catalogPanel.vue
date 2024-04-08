<template>
  <div class="tab-box">
    <div class="title">主题设置</div>
    <div class="content">
      <div  class="tag-list">
        <el-tag 
          v-for="item in groupList"
          :class="[groupName === item.value ? 'current' : '', 'tag']"  
          type = 'info' 
          :key="item.value"
          @click="() => changeGroup(item.value)">
          {{item.label}}
        </el-tag>
      </div>
      <div class="banner-list-wrapper">
        <div
          class="single-banner-wrapper"
          v-for="(banner, bannerIndex) in currentBannerList"
          :key="bannerIndex"
        >
          <img
            class="banner-img"
            :src="banner.src"
            loading="lazy"
            @click="changePreset(banner)"
          />
        </div>
      </div>
    </div>
    
   
  </div>
</template>
<script>
import { mapActions } from 'vuex'

import skinPresets from '@/management/config/skinPresets.js'
export default {
  name: 'catalogPanel',
  data() {
    return {
      skinPresets: [],
      groupName: 'temp',
    };
  },
  computed: {
    bannerList() {
      return this.$store?.state?.bannerList || [];
    },
    groupList() {
      return Object.keys(this.bannerList).map((key) => {
        return {
          label: this.bannerList[key].name,
          value: key
        }
      })
    },
    currentBannerList () {
      const arr =  Object.keys(this.bannerList).map((key) => {
        return  this.bannerList[key]
      }).map(data => {
        return data.list.map(item => {
          item.group = data.key;
          return item;
        })
      })
      const  allbanner =  arr.reduce((acc, curr) => {
        return acc.concat(curr);
      }, []);
      return allbanner.filter(item => {
        if(this.groupName === "temp") {
          return true
        } else {
          return item.group === this.groupName
        }
      })
    }
  },
  mounted() {
    
  },
  methods: {
    ...mapActions({
      changeThemePreset: 'edit/changeThemePreset',
    }),
    changeGroup(value) {
      this.groupName = value
    },
  changePreset(banner) {
      const name = banner.group + '-' + banner.title
      let presets = {
        'bannerConf.bannerConfig.bgImage': banner.src,
        'skinConf.themeConf.color': '#FAA600',
        'skinConf.backgroundConf.color': '#fff',
      }
      if(skinPresets[name]){
        presets = Object.assign(presets, skinPresets[name])
      }
       
      
      this.changeThemePreset(presets)
    }
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.tab-box {
  width: 300px;
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
  .content{ 
    padding: 12px;
  }
  .tag-list{
    display: flex;
    flex-wrap: wrap;
    .tag{
      margin: 5px 8px;
      cursor: pointer;
      &.current{
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

    ::v-deep .el-collapse-item__header {
      font-size: 16px;
      color: $font-color-title;
      border-bottom: none;
    }

    ::v-deep .el-collapse-item__arrow.is-active {
      right: 0;
    }
    ::v-deep .el-collapse-item__arrow {
      right: 0;
    }
  }
}
</style>