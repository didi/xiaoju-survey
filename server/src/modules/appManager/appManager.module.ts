import { Module } from '@nestjs/common';
import { AppManagerController } from './controllers/appManager.controller';
import { AppManagerService } from './services/appManager.service';
import { OpenAuthGuard } from 'src/guards/openAuth.guard';

@Module({
  controllers: [AppManagerController],
  providers: [AppManagerService, OpenAuthGuard],
  exports: [AppManagerService],
})
export class AppManagerModule {}
