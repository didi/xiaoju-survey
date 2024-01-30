import { Provider } from '@nestjs/common';

import logger, { Logger } from './index';

export const LoggerProvider: Provider = {
  provide: Logger,
  useValue: logger,
};
