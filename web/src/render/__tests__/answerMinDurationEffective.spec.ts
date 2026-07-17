import { describe, it, expect } from 'vitest'

import { type AnswerTimeLimitConf, getEffectiveAnswerMinDuration } from '../types/answerTimeLimit'

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
