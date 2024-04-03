import { CreateMessagePushingTaskDto } from '../dto/createMessagePushingTask.dto';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';

describe('CreateMessagePushingTaskDto', () => {
  let dto: CreateMessagePushingTaskDto;

  beforeEach(() => {
    dto = new CreateMessagePushingTaskDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a name', () => {
    dto.name = '';
    expect(dto.name).toBeDefined();
    expect(dto.name).toBe('');
  });

  it('should have a valid type', () => {
    dto.type = MESSAGE_PUSHING_TYPE.HTTP;
    expect(dto.type).toBeDefined();
    expect(dto.type).toEqual(MESSAGE_PUSHING_TYPE.HTTP);
  });

  it('should have a push address', () => {
    dto.pushAddress = '';
    expect(dto.pushAddress).toBeDefined();
    expect(dto.pushAddress).toBe('');
  });

  it('should have a valid trigger hook', () => {
    dto.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED;
    expect(dto.triggerHook).toBeDefined();
    expect(dto.triggerHook).toEqual(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED);
  });

  it('should have an array of surveys', () => {
    dto.surveys = ['survey1', 'survey2'];
    expect(dto.surveys).toBeDefined();
    expect(dto.surveys).toEqual(['survey1', 'survey2']);
  });
});
