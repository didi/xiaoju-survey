import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpClientService } from './service/httpClient.service';

@Module({
  imports: [HttpModule],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
