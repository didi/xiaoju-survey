import ComponentLoader from '@/materials/utils/componentLoader';
export class SetterLoader extends ComponentLoader {
  dynamicImport(path) {
    return import(`@/materials/setters/widgets/${path}.vue`);
  }
}

const setterLoader = new SetterLoader();

export default setterLoader;
