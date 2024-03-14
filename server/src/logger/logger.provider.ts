import { Provider } from '@nestjs/common';

import { Logger } from './index';

export const LoggerProvider: Provider = {
  provide: Logger,
  useClass: Logger,
};
