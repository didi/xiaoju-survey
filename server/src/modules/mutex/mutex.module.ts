import { Global, Module } from '@nestjs/common';  
import { MutexService } from './services/mutexService.service'

@Global()
@Module({  
  providers: [MutexService],  
  exports: [MutexService],  
})  
export class MutexModule {}