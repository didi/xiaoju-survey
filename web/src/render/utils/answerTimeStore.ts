import {
  type AnswerTimeRecord,
  type AnswerTimeLimitConf,
  type AnswerTimeUnit,
  normalizeUnit,
  unitToMs
} from '../types/answerTimeLimit'

export const ANSWER_TIME_KEY_PREFIX = 'survey-engine:answer-time:'

const buildKey = (surveyPath: string): string => `${ANSWER_TIME_KEY_PREFIX}${surveyPath}`

const safeStorage = (): Storage | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage
  } catch (e) {
    // localStorage may be unavailable (privacy mode, server-side render)
  }
  return null
}

export const read = (surveyPath: string): AnswerTimeRecord | null => {
  if (!surveyPath) return null
  const storage = safeStorage()
  if (!storage) return null
  try {
    const raw = storage.getItem(buildKey(surveyPath))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<AnswerTimeRecord>
    if (
      !parsed ||
      typeof parsed.remainingMs !== 'number' ||
      typeof parsed.startedAt !== 'number' ||
      typeof parsed.duration !== 'number'
    ) {
      return null
    }
    return {
      surveyPath,
      remainingMs: parsed.remainingMs,
      startedAt: parsed.startedAt,
      duration: parsed.duration,
      unit: normalizeUnit(parsed.unit),
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now()
    }
  } catch (e) {
    return null
  }
}

export const write = (record: AnswerTimeRecord): void => {
  const storage = safeStorage()
  if (!storage || !record?.surveyPath) return
  try {
    storage.setItem(
      buildKey(record.surveyPath),
      JSON.stringify({ ...record, updatedAt: Date.now() })
    )
  } catch (e) {
    // quota exceeded / privacy mode — ignore
  }
}

export const clear = (surveyPath: string): void => {
  if (!surveyPath) return
  const storage = safeStorage()
  if (!storage) return
  try {
    storage.removeItem(buildKey(surveyPath))
  } catch (e) {
    // ignore
  }
}

export const init = (
  surveyPath: string,
  conf: AnswerTimeLimitConf | null | undefined
): AnswerTimeRecord | null => {
  if (!surveyPath || !conf || !conf.enabled) return null
  const unit: AnswerTimeUnit = normalizeUnit(conf.unit)
  const duration = typeof conf.duration === 'number' && conf.duration > 0 ? conf.duration : 30
  const totalMs = unitToMs(duration, unit)
  const existing = read(surveyPath)
  if (existing && existing.duration === duration && existing.unit === unit) {
    return existing
  }
  const fresh: AnswerTimeRecord = {
    surveyPath,
    remainingMs: totalMs,
    startedAt: 0,
    duration,
    unit,
    updatedAt: Date.now()
  }
  write(fresh)
  return fresh
}
