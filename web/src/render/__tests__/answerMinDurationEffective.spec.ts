import { describe, it, expect } from 'vitest'

import {
  type AnswerTimeLimitConf,
  getEffectiveAnswerMinDuration,
  normalizeAnswerTimeConf
} from '../types/answerTimeLimit'

const conf = (
  duration: number,
  unit: AnswerTimeLimitConf['unit'] = 'minute'
): AnswerTimeLimitConf => ({
  enabled: true,
  duration,
  unit
})

describe('C-end answerMinDuration runtime effectiveness', () => {
  it('treats min duration as not effective when min is equal to answer time limit', () => {
    expect(getEffectiveAnswerMinDuration(conf(1), conf(1))).toBeNull()
  })

  it('treats min duration as not effective when min is greater than answer time limit', () => {
    expect(getEffectiveAnswerMinDuration(conf(5), conf(1))).toBeNull()
  })

  it('normalizes units before comparing min duration and answer time limit', () => {
    expect(getEffectiveAnswerMinDuration(conf(2, 'minute'), conf(30, 'second'))).toBeNull()
  })

  it('keeps min duration effective when it is less than answer time limit', () => {
    const min = conf(5)
    expect(getEffectiveAnswerMinDuration(min, conf(30))).toBe(min)
  })

  it('keeps min duration effective when only min duration is enabled', () => {
    const min = conf(5)
    expect(getEffectiveAnswerMinDuration(min, null)).toBe(min)
  })
})

describe('C-end answer time config validation', () => {
  it('does not apply enabled config with invalid duration', () => {
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: null, unit: 'minute' })
    ).toBeNull()
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: 1.5, unit: 'minute' })
    ).toBeNull()
  })

  it('does not apply enabled config outside runtime bounds', () => {
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: 1441, unit: 'minute' })
    ).toBeNull()
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: 9, unit: 'second' })
    ).toBeNull()
  })

  it('does not apply config with invalid unit instead of defaulting it', () => {
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: 30, unit: 'hour' })
    ).toBeNull()
  })

  it('keeps valid enabled config as-is', () => {
    expect(
      normalizeAnswerTimeConf({ enabled: true, duration: 30, unit: 'minute' })
    ).toEqual({ enabled: true, duration: 30, unit: 'minute' })
  })
})
