import { BaseEntity } from '../base.entity';
import { RECORD_STATUS } from 'src/enums';

describe('BaseEntity', () => {
  let baseEntity: BaseEntity;

  beforeEach(() => {
    baseEntity = new BaseEntity();
  });

  it('should initialize default info before insert', () => {
    const now = Date.now();
    baseEntity.initDefaultInfo();

    expect(baseEntity.curStatus.status).toBe(RECORD_STATUS.NEW);
    expect(baseEntity.curStatus.date).toBeCloseTo(now, -3);
    expect(baseEntity.statusList).toHaveLength(1);
    expect(baseEntity.statusList[0].status).toBe(RECORD_STATUS.NEW);
    expect(baseEntity.statusList[0].date).toBeCloseTo(now, -3);
    expect(baseEntity.createDate).toBeCloseTo(now, -3);
    expect(baseEntity.updateDate).toBeCloseTo(now, -3);
  });

  it('should update updateDate before update', () => {
    const now = Date.now();
    baseEntity.onUpdate();

    expect(baseEntity.updateDate).toBeCloseTo(now, -3);
  });
});
