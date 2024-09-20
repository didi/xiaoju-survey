import xiaojuSurveyPluginManager, {
  PluginManager,
} from './pluginManager';
import { Provider } from '@nestjs/common';

export const PluginManagerProvider: Provider = {
  provide: PluginManager,
  useValue: xiaojuSurveyPluginManager,
};
