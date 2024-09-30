import { UpdateMessagePushingTaskDto } from '../dto/updateMessagePushingTask.dto';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';

describe('UpdateMessagePushingTaskDto', () => {
  let dto: UpdateMessagePushingTaskDto;

  beforeEach(() => {
    dto = new UpdateMessagePushingTaskDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a nullable name', () => {
    dto.name = null;
    expect(dto.name).toBeNull();
  });

  it('should have a nullable type', () => {
    dto.type = null;
    expect(dto.type).toBeNull();
  });

  it('should have a nullable push address', () => {
    dto.pushAddress = null;
    expect(dto.pushAddress).toBeNull();
  });

  it('should have a triggerHook', () => {
    dto.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED;
    expect(dto.triggerHook).toBeDefined();
    expect(dto.triggerHook).toEqual(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED);
  });

  it('should have a nullable array of surveys', () => {
    dto.surveys = null;
    expect(dto.surveys).toBeNull();
  });
});
