import ComponentLoader from '@/materials/utils/componentLoader'
import { defineAsyncComponent } from 'vue'

export class CommunalLoader extends ComponentLoader {
  dynamicImport(path) {
    return import(`./widgets/${path}.vue`)
  }
  defineAsyncComponent(path) {
    return defineAsyncComponent({
      loader: () => import(`./widgets/${path}/index.jsx`),
      delay: 200,
      timeout: 3000
    })
  }
}

const communalLoader = new CommunalLoader()

export default communalLoader
