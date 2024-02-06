import xiaojuSurveyPluginManager, {
  XiaojuSurveyPluginManager,
} from './pluginManager';
import { Provider } from '@nestjs/common';

export const PluginManagerProvider: Provider = {
  provide: XiaojuSurveyPluginManager,
  useValue: xiaojuSurveyPluginManager,
};
