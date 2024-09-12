import { Provider } from '@nestjs/common';

import { XiaojuSurveyLogger } from './index';

export const LoggerProvider: Provider = {
  provide: XiaojuSurveyLogger,
  useClass: XiaojuSurveyLogger,
};
