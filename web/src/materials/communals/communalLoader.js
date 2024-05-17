import ComponentLoader from '@/materials/utils/componentLoader'
export class CommunalLoader extends ComponentLoader {
  dynamicImport(path) {
    return import(`./widgets/${path}.vue`)
  }
}

const communalLoader = new CommunalLoader()

export default communalLoader
