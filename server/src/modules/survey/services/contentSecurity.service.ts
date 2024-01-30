import { Injectable } from '@nestjs/common';
import { Word } from 'src/models/word.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ContentSecurityService {
  private forbiddenWords = null;
  constructor(
    @InjectRepository(Word)
    private readonly wordRepository: MongoRepository<Word>,
  ) {}

  private async initForbiddenWords() {
    const words = await this.wordRepository.find({
      where: {
        type: 'forbidden',
      },
    });
    this.forbiddenWords = words.map((item) => item.text);
  }

  async isForbiddenContent({ text }: { text: string }) {
    if (!this.forbiddenWords) {
      await this.initForbiddenWords();
    }
    for (const word of this.forbiddenWords) {
      if (text.includes(word)) {
        return true;
      }
    }
    return false;
  }
}
