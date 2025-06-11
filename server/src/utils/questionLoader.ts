// // server/src/utils/questionLoader.ts

// import ComponentLoader from './componentLoader';
// import moduleList from './moduleList';
// import pathModule from 'path';
// import { pathToFileURL } from 'url';

// export default class MaterialLoader extends ComponentLoader {
//   // 缓存从 widgets 目录动态加载的 meta 对象
//   private metaCache: Record<string, any> = {};
//   private inited = false;

//   /** typeList 仍然是 QUESTION_TYPE[], path 由 moduleList 映射 */
//   async init(options: { typeList: string[] }): Promise<void> {
//     if (this.inited) return;
//     this.inited = true;

//     // 根据 moduleList 生成组件路径，跟之前一致
//     this.componentInfoList = options.typeList.map((type) => {
//       const folder = moduleList[type as keyof typeof moduleList];
//       if (!folder) throw new Error(`Unknown widget folder for type ${type}`);
//       return { type, path: folder };
//     });

//     // 先加载组件
//     await this.loadComponents();

//     // 再并行去加载每个组件下的 meta.js
//     await Promise.all(
//       this.componentInfoList.map(({ type, path }) => this.loadMeta(type, path))
//     );
//   }

//   /** 动态加载组件本体 */
//   dynamicImport(folder: string): Promise<any> {
//     // 注意：__dirname 在编译后的 dist/utils 目录里
//     const filePath = pathModule.join(__dirname, 'widgets', folder, 'index.js');
//     const fileUrl = pathToFileURL(filePath).href;
//     return import(fileUrl);
//   }

//   /** 动态加载单个题型的 meta.js 并缓存 */
//   async loadMeta(type: string, folder: string): Promise<void> {
//    try {
//      const mod = await import(
//        /* webpackIgnore: true */ `./widgets/${folder}/meta.js`
//      );
//      this.metaCache[type] = mod.default ?? mod.meta ?? {};
//    } catch (err) {
//      console.warn(`Failed to load meta for ${type}`, err);
//      this.metaCache[type] = {};
//   }

//   }

//   /** 给外部使用，拿到完整的 meta 对象 */
//   getMeta(type: string): any {
//     return this.metaCache[type] || {};
//   }
// }

// // 单例导出
// const questionLoader = new MaterialLoader();
// export { questionLoader };
// server/src/utils/questionLoader.ts

import moduleList from './moduleList';
import path from 'path';
import { pathToFileURL } from 'url';

/**
 * 这个 Loader 只做一件事：根据 moduleList，把每个题型的 meta.js
 * 动态 import 进来，存到 metaCache。完全不管 index.jsx。
 */
export default class MaterialLoader {
  private metaCache: Record<string, any> = {};
  private inited = false;

  /**
   * options.typeList 一定要和 moduleList 的 key 对齐
   */
  async init(options: { typeList: string[] }): Promise<void> {
    if (this.inited) return;
    this.inited = true;

    await Promise.all(
      options.typeList.map((type) => {
        const folder = moduleList[type as keyof typeof moduleList];
        if (!folder) {
          throw new Error(`Unknown widget type: ${type}`);
        }
        return this.loadMeta(type, folder);
      })
    );
  }

  /**
   * 真正加载 dist/utils/widgets/{folder}/meta.js
   */
  private async loadMeta(type: string, folder: string) {
    const filePath = path.join(
      __dirname,
      'widgets',
      folder,
      'meta.js'
    );
    const fileUrl = pathToFileURL(filePath).href;
    try {
      const mod = await import(/* webpackIgnore: true */ fileUrl);
      this.metaCache[type] = mod.default ?? mod.meta ?? {};
    } catch (err) {
      console.warn(`Failed to load meta for ${type}:`, err);
      this.metaCache[type] = {};
    }
  }

  /**
   * 外部拿 meta 就调用它，不会去找 index.jsx
   */
  getMeta(type: string): any {
    return this.metaCache[type] || {};
  }
}

// 单例
export const questionLoader = new MaterialLoader();
