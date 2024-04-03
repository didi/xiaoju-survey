import { QueryMessagePushingTaskListDto } from '../dto/queryMessagePushingTaskList.dto';
import { MESSAGE_PUSHING_HOOK } from 'src/enums/messagePushing';

describe('QueryMessagePushingTaskListDto', () => {
  let dto: QueryMessagePushingTaskListDto;

  beforeEach(() => {
    dto = new QueryMessagePushingTaskListDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a surveyId', () => {
    dto.surveyId = 'surveyId';
    expect(dto.surveyId).toBeDefined();
    expect(dto.surveyId).toBe('surveyId');
  });

  it('should have a triggerHook', () => {
    dto.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED; // Set your desired hook here
    expect(dto.triggerHook).toBeDefined();
    expect(dto.triggerHook).toEqual(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED); // Adjust based on your enum
  });
});
