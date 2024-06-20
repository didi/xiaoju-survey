import { defineAsyncComponent } from 'vue'

export class CommunalLoader {
  loadComponent(path) {
    return defineAsyncComponent({
      loader: () => import(`./widgets/${path}/index.jsx`),
      delay: 200,
      timeout: 3000
    })
  }
}

const communalLoader = new CommunalLoader()

export default communalLoader
