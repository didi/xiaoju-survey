import { EventEmitter } from 'events';
import { SurveyDownloadService } from './surveyDownload.service';
import { Inject, Injectable } from '@nestjs/common';
import { ResponseSchema } from 'src/models/responseSchema.entity';

interface QueueItem {
  surveyId: string;
  responseSchema: ResponseSchema;
  isDesensitive: boolean;
  id: object;
}

@Injectable()
export class MessageService extends EventEmitter {
  private queue: QueueItem[];
  private concurrency: number;
  private processing: number;

  constructor(
    @Inject('NumberToken') concurrency: number,
    private readonly surveyDownloadService: SurveyDownloadService,
  ) {
    super();
    this.queue = [];
    this.concurrency = concurrency;
    this.processing = 0;
    this.on('messageAdded', this.processMessages);
  }

  public addMessage({
    surveyId,
    responseSchema,
    isDesensitive,
    id,
  }: {
    surveyId: string;
    responseSchema: ResponseSchema;
    isDesensitive: boolean;
    id: object;
  }) {
    const message = {
      surveyId,
      responseSchema,
      isDesensitive,
      id,
    };
    this.queue.push(message);
    this.emit('messageAdded');
  }

  private processMessages = async (): Promise<void> => {
    if (this.processing >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const messagesToProcess = Math.min(
      this.queue.length,
      this.concurrency - this.processing,
    );
    const messages = this.queue.splice(0, messagesToProcess);

    this.processing += messagesToProcess;

    await Promise.all(
      messages.map(async (message) => {
        console.log(`开始计算: ${message}`);
        await this.handleMessage(message);
        this.emit('messageProcessed', message);
      }),
    );

    this.processing -= messagesToProcess;
    if (this.queue.length > 0) {
      setImmediate(() => this.processMessages());
    }
  };

  async handleMessage(message: QueueItem) {
    const { surveyId, responseSchema, isDesensitive, id } = message;
    await this.surveyDownloadService.getDownloadPath({
      responseSchema,
      surveyId,
      isDesensitive,
      id,
    });
  }
}
