import { setServerConfig } from './utils/http';
import { Modal } from './containers/Modal';
import type { SurveyOptions } from './constants/interface';

export const Survey = {
  show(options: SurveyOptions) {
    Modal.show(options);
  },
  close() {
    Modal.remove();
  },
  init(config: {
    host: string;
    port?: number;
    appId?: string;
    channelId: string;
  }) {
    const { host, port, appId, channelId } = config;
    setServerConfig({
      host,
      port,
      appId,
      channelId,
    });
  },
};
