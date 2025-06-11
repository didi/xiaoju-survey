// server/src/utils/componentLoader.ts

import { cloneDeep as _cloneDeep } from 'lodash';

export interface ComponentInfo {
  type: string;
  path?: string;
}

export interface LifeCycle {
  onComponentLoaded?: (args: { component: any; type: string; meta: any }) => void;
}

export default class ComponentLoader {
  protected components: Record<string, any> = {};
  protected componentInfoList: ComponentInfo[];
  protected lifeCycle?: LifeCycle;

  constructor(options: { componentList?: ComponentInfo[]; lifeCycle?: LifeCycle } = {}) {
    const { componentList, lifeCycle } = options;
    this.components = {};
    this.componentInfoList = componentList || [];
    if (lifeCycle) {
      this.lifeCycle = lifeCycle;
    }
  }

  async loadComponent(type: string, path: string): Promise<{ type: string; component: any }> {
    if (this.components[type]) {
      return { type, component: this.components[type] };
    }
    let count = 0;
    const load = async (): Promise<{ type: string; component: any }> => {
      try {
        count++;
        const res = await this.dynamicImport(path);
        const indexComp = res.default?.components?.Index;
        const component = indexComp ? _cloneDeep(indexComp) : res.default;
        if (!component.name) {
          component.name = path || type;
        }
        component.path = path;
        this.components[type] = component;
        if (this.lifeCycle?.onComponentLoaded) {
          this.lifeCycle.onComponentLoaded({ component, type, meta: res.meta });
        }
        return { type, component };
      } catch (error) {
        if (count < 3) {
          return load();
        }
        throw error;
      }
    };
    return load();
  }

  loadComponents(componentList?: ComponentInfo[]): Promise<Array<{ type: string; component: any }>> {
    const list = componentList || this.componentInfoList;
    return Promise.all(list.map((item) => this.loadComponent(item.type, item.path || '')));
  }

  protected dynamicImport(path: string): Promise<any> {
    // Override in subclass if needed
    return import(`./widgets/${path}/index.jsx`);
  }
}
