export type AnswerTimeUnit = 'minute' | 'second'

export interface AnswerTimeLimitConf {
  enabled: boolean
  duration: number
  unit: AnswerTimeUnit
}

export interface AnswerTimeRecord {
  surveyPath: string
  remainingMs: number
  startedAt: number
  duration: number
  unit: AnswerTimeUnit
  updatedAt: number
}

export const DEFAULT_DURATION = 30
export const MAX_MINUTE = 1440
export const MIN_SECOND = 10

export const unitToMs = (duration: number, unit: AnswerTimeUnit): number => {
  return unit === 'second' ? duration * 1000 : duration * 60 * 1000
}

export const normalizeUnit = (unit: unknown): AnswerTimeUnit => {
  return unit === 'second' ? 'second' : 'minute'
}

export const isAnswerTimeUnit = (unit: unknown): unit is AnswerTimeUnit => {
  return unit === 'minute' || unit === 'second'
}

export const isValidDuration = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

export const isWithinBounds = (duration: number, unit: AnswerTimeUnit): boolean => {
  if (!isValidDuration(duration)) return false
  if (unit === 'minute') return duration <= MAX_MINUTE
  return duration >= MIN_SECOND
}

export const validateAnswerTimeConf = (raw: unknown): raw is AnswerTimeLimitConf => {
  if (!raw || typeof raw !== 'object') return false
  const conf = raw as Partial<AnswerTimeLimitConf>
  if (conf.enabled !== true) return false
  if (!isAnswerTimeUnit(conf.unit)) return false
  if (!isValidDuration(conf.duration)) return false
  return isWithinBounds(conf.duration, conf.unit)
}

export const normalizeAnswerTimeConf = (raw: unknown): AnswerTimeLimitConf | null => {
  if (!validateAnswerTimeConf(raw)) return null
  return {
    enabled: true,
    duration: raw.duration,
    unit: raw.unit
  }
}

export const getEffectiveAnswerMinDuration = (
  minDuration: AnswerTimeLimitConf | null,
  timeLimit: AnswerTimeLimitConf | null
): AnswerTimeLimitConf | null => {
  if (!minDuration?.enabled) return null
  if (!timeLimit?.enabled) return minDuration
  return unitToMs(minDuration.duration, minDuration.unit) <
    unitToMs(timeLimit.duration, timeLimit.unit)
    ? minDuration
    : null
}
