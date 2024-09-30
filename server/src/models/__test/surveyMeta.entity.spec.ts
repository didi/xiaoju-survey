import { SurveyMeta } from '../surveyMeta.entity';
import { RECORD_STATUS, RECORD_SUB_STATUS } from 'src/enums';

// 模拟日期
const mockDateNow = Date.now();

describe('SurveyMeta Entity', () => {
  let surveyMeta: SurveyMeta;

  // 在每个测试之前，初始化 SurveyMeta 实例
  beforeEach(() => {
    surveyMeta = new SurveyMeta();
    // 模拟 Date.now() 返回固定的时间
    jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);
  });

  afterEach(() => {
    jest.restoreAllMocks(); // 每次测试后还原所有 mock
  });

  it('should set default curStatus and subStatus on insert when they are not provided', () => {
    surveyMeta.initDefaultInfo();

    // 验证 curStatus 是否被初始化为默认值
    expect(surveyMeta.curStatus).toEqual({
      status: RECORD_STATUS.NEW,
      date: mockDateNow,
    });

    // 验证 statusList 是否包含 curStatus
    expect(surveyMeta.statusList).toEqual([
      {
        status: RECORD_STATUS.NEW,
        date: mockDateNow,
      },
    ]);

    // 验证 subStatus 是否被初始化为默认值
    expect(surveyMeta.subStatus).toEqual({
      status: RECORD_SUB_STATUS.DEFAULT,
      date: mockDateNow,
    });
  });

  it('should initialize statusList if curStatus is provided but statusList is empty', () => {
    surveyMeta.curStatus = null;

    surveyMeta.initDefaultInfo();

    expect(surveyMeta.statusList).toEqual([
      {
        status: RECORD_STATUS.NEW,
        date: expect.any(Number),
      },
    ]);
  });
});
