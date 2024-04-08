import {
  MessagePushingTaskDto,
  CodeDto,
  MessagePushingTaskSucceedResponseDto,
  MessagePushingTaskListSucceedResponse,
} from '../dto/messagePushingTask.dto';
import {
  MESSAGE_PUSHING_TYPE,
  MESSAGE_PUSHING_HOOK,
} from 'src/enums/messagePushing';
import { RECORD_STATUS } from 'src/enums';

describe('MessagePushingTaskDto', () => {
  let dto: MessagePushingTaskDto;

  beforeEach(() => {
    dto = new MessagePushingTaskDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have an id', () => {
    dto._id = 'test_id';
    expect(dto._id).toBeDefined();
    expect(dto._id).toBe('test_id');
  });

  it('should have a name', () => {
    dto.name = 'test_name';
    expect(dto.name).toBeDefined();
    expect(dto.name).toBe('test_name');
  });

  it('should have a type', () => {
    dto.type = MESSAGE_PUSHING_TYPE.HTTP; // Set your desired type here
    expect(dto.type).toBeDefined();
    expect(dto.type).toEqual(MESSAGE_PUSHING_TYPE.HTTP); // Adjust based on your enum
  });

  it('should have a push address', () => {
    dto.pushAddress = 'test_address';
    expect(dto.pushAddress).toBeDefined();
    expect(dto.pushAddress).toBe('test_address');
  });

  it('should have a trigger hook', () => {
    dto.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED; // Set your desired hook here
    expect(dto.triggerHook).toBeDefined();
    expect(dto.triggerHook).toEqual(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED); // Adjust based on your enum
  });

  it('should have an array of surveys', () => {
    dto.surveys = ['survey1', 'survey2']; // Set your desired surveys here
    expect(dto.surveys).toBeDefined();
    expect(dto.surveys).toEqual(['survey1', 'survey2']);
  });

  it('should have an owner', () => {
    dto.owner = 'test_owner';
    expect(dto.owner).toBeDefined();
    expect(dto.owner).toBe('test_owner');
  });

  it('should have current status', () => {
    dto.curStatus = { status: RECORD_STATUS.NEW, date: Date.now() };
    expect(dto.curStatus).toBeDefined();
    expect(dto.curStatus.status).toEqual(RECORD_STATUS.NEW);
    expect(dto.curStatus.date).toBeDefined();
  });
});

describe('CodeDto', () => {
  let dto: CodeDto;

  beforeEach(() => {
    dto = new CodeDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a code', () => {
    dto.code = 200;
    expect(dto.code).toBeDefined();
    expect(dto.code).toBe(200);
  });
});

describe('MessagePushingTaskSucceedResponseDto', () => {
  let dto: MessagePushingTaskSucceedResponseDto;

  beforeEach(() => {
    dto = new MessagePushingTaskSucceedResponseDto();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a code', () => {
    dto.code = 200;
    expect(dto.code).toBeDefined();
    expect(dto.code).toBe(200);
  });

  it('should have data', () => {
    const taskDto = new MessagePushingTaskDto();
    dto.data = taskDto;
    expect(dto.data).toBeDefined();
    expect(dto.data).toBeInstanceOf(MessagePushingTaskDto);
  });
});

describe('MessagePushingTaskListSucceedResponse', () => {
  let dto: MessagePushingTaskListSucceedResponse;

  beforeEach(() => {
    dto = new MessagePushingTaskListSucceedResponse();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
  });

  it('should have a code', () => {
    dto.code = 200;
    expect(dto.code).toBeDefined();
    expect(dto.code).toBe(200);
  });

  it('should have data', () => {
    const taskDto = new MessagePushingTaskDto();
    dto.data = [taskDto];
    expect(dto.data).toBeDefined();
    expect(dto.data).toBeInstanceOf(Array);
    expect(dto.data[0]).toBeInstanceOf(MessagePushingTaskDto);
  });
});
