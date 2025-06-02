import ComponentLoader from '../utils/componentLoader'
import moduleList from './common/config/moduleList'

export class MaterialLoader extends ComponentLoader {
  metaCache = {}
  inited = false
  async init({ typeList }) {
    if (this.inited) {
      return
    }

    this.inited = true
    this.componentInfoList = typeList.map((type) => ({
      type,
      path: moduleList[type]
    }))
    await this.loadComponents()
    await this.loadMetas()
  }

  dynamicImport(path) {
    // see https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
    return import(`./widgets/${path}/index.jsx`)
  }

  setMeta(type, config) {
    this.components[type].meta = config
  }

  async loadMeta(type, path) {
    if (this.metaCache[type]) {
      return this.metaCache[type]
    } else {
      if (!this.components[type]) {
        console.error('The component has not been loaded yet')
      }
      path = path || this.components[type]?.path || type
      const res = await import(`./widgets/${path}/meta.js`)
      this.metaCache[type] = res.default || res.meta || null
      return this.metaCache[type]
    }
  }

  getMeta(type) {
    return this.metaCache[type] ? this.metaCache[type] : {}
  }

  loadMetas(typeList) {
    if (!typeList) {
      typeList = this.componentInfoList.map((item) => item.type)
    }
    return Promise.all(typeList.map((type) => this.loadMeta(type)))
  }
}

const questionLoader = new MaterialLoader()

export default questionLoader
