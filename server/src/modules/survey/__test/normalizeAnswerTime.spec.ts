import {
  normalizeAnswerDurationConf,
  normalizeBaseConfAnswerTime,
} from '../utils/normalizeAnswerTime';
import { BaseConf } from 'src/interfaces/survey';

// T-TEST-02：updateConf 参数 normalize（unit 缺省 / duration 非法 / 越界 / enabled 强制 boolean）
describe('normalizeAnswerTime util (T-TEST-02 / T-BE-04)', () => {
  describe('normalizeAnswerDurationConf', () => {
    it('returns undefined for undefined / null input', () => {
      expect(normalizeAnswerDurationConf(undefined)).toBeUndefined();
      expect(normalizeAnswerDurationConf(null)).toBeUndefined();
    });

    it('defaults unit to "minute" when missing', () => {
      const out = normalizeAnswerDurationConf({ enabled: true, duration: 30 });
      expect(out).toEqual({ enabled: true, duration: 30, unit: 'minute' });
    });

    it('defaults unit to "minute" when illegal', () => {
      const out = normalizeAnswerDurationConf({
        enabled: true,
        duration: 30,
        unit: 'hour',
      });
      expect(out?.unit).toBe('minute');
    });

    it('accepts unit = "second"', () => {
      const out = normalizeAnswerDurationConf({
        enabled: true,
        duration: 30,
        unit: 'second',
      });
      expect(out?.unit).toBe('second');
    });

    it('coerces non-positive / non-integer / non-numeric duration to 30', () => {
      expect(
        normalizeAnswerDurationConf({ enabled: true, duration: 0 })?.duration,
      ).toBe(30);
      expect(
        normalizeAnswerDurationConf({ enabled: true, duration: -5 })?.duration,
      ).toBe(30);
      expect(
        normalizeAnswerDurationConf({ enabled: true, duration: 1.5 })?.duration,
      ).toBe(30);
      expect(
        normalizeAnswerDurationConf({
          enabled: true,
          duration: 'abc' as any,
        })?.duration,
      ).toBe(30);
      expect(
        normalizeAnswerDurationConf({
          enabled: true,
          duration: NaN,
        })?.duration,
      ).toBe(30);
    });

    it('keeps a valid positive-integer duration as-is (no upper bound at BE)', () => {
      expect(
        normalizeAnswerDurationConf({ enabled: true, duration: 1 })?.duration,
      ).toBe(1);
      // BE 不强制上下限（CL-016 由 FE 兜底）
      expect(
        normalizeAnswerDurationConf({ enabled: true, duration: 99999 })
          ?.duration,
      ).toBe(99999);
    });

    it('coerces enabled to boolean', () => {
      expect(
        normalizeAnswerDurationConf({
          enabled: 1 as any,
          duration: 30,
          unit: 'minute',
        })?.enabled,
      ).toBe(false);
      expect(
        normalizeAnswerDurationConf({
          enabled: 'yes' as any,
          duration: 30,
          unit: 'minute',
        })?.enabled,
      ).toBe(false);
      expect(
        normalizeAnswerDurationConf({
          enabled: true,
          duration: 30,
          unit: 'minute',
        })?.enabled,
      ).toBe(true);
      expect(
        normalizeAnswerDurationConf({
          duration: 30,
          unit: 'minute',
        } as any)?.enabled,
      ).toBe(false);
    });
  });

  describe('normalizeBaseConfAnswerTime', () => {
    it('is a no-op when baseConf is undefined / answer fields missing', () => {
      expect(() => normalizeBaseConfAnswerTime(undefined)).not.toThrow();
      const baseConf = { beginTime: '' } as unknown as BaseConf;
      normalizeBaseConfAnswerTime(baseConf);
      expect(baseConf.answerTimeLimit).toBeUndefined();
      expect(baseConf.answerMinDuration).toBeUndefined();
    });

    it('normalizes both answerTimeLimit and answerMinDuration in place', () => {
      const baseConf = {
        answerTimeLimit: { enabled: true, duration: -1, unit: 'hour' },
        answerMinDuration: { enabled: 'on', duration: 0 },
      } as unknown as BaseConf;
      normalizeBaseConfAnswerTime(baseConf);
      expect(baseConf.answerTimeLimit).toEqual({
        enabled: true,
        duration: 30,
        unit: 'minute',
      });
      expect(baseConf.answerMinDuration).toEqual({
        enabled: false,
        duration: 30,
        unit: 'minute',
      });
    });
  });
});
