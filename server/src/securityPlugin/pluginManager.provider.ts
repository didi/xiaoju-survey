import securityPluginManager, { PluginManager } from './pluginManager';
import { Provider } from '@nestjs/common';

export const PluginManagerProvider: Provider = {
  provide: PluginManager,
  useValue: securityPluginManager,
};
