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
    dto.type = MESSAGE_PUSHING_TYPE.HTTP;
    expect(dto.type).toBeDefined();
    expect(dto.type).toEqual(MESSAGE_PUSHING_TYPE.HTTP);
  });

  it('should have a push address', () => {
    dto.pushAddress = 'test_address';
    expect(dto.pushAddress).toBeDefined();
    expect(dto.pushAddress).toBe('test_address');
  });

  it('should have a trigger hook', () => {
    dto.triggerHook = MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED;
    expect(dto.triggerHook).toBeDefined();
    expect(dto.triggerHook).toEqual(MESSAGE_PUSHING_HOOK.RESPONSE_INSERTED);
  });

  it('should have an array of surveys', () => {
    dto.surveys = ['survey1', 'survey2'];
    expect(dto.surveys).toBeDefined();
    expect(dto.surveys).toEqual(['survey1', 'survey2']);
  });

  it('should have an owner', () => {
    dto.owner = 'test_owner';
    expect(dto.owner).toBeDefined();
    expect(dto.owner).toBe('test_owner');
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
