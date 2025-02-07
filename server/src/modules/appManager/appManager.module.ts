import { Module } from '@nestjs/common';
import { AppManagerController } from './controllers/appManager.controller';
import { AppManagerService } from './services/appManager.service';

@Module({
  controllers: [AppManagerController],
  providers: [AppManagerService],
})
export class AppManagerModule {}
