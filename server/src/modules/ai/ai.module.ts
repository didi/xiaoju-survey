// server/src/modules/ai/ai.module.ts

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
