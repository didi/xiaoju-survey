import { describe, it, expect, beforeEach } from 'vitest'
import {
  read,
  write,
  clear,
  init,
  ANSWER_TIME_KEY_PREFIX
} from '../utils/answerTimeStore'

const FIXED_NOW = 1_700_000_000_000

describe('answerTimeStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('write / read', () => {
    it('writes record under survey-engine:answer-time:{surveyPath}', () => {
      write({
        surveyPath: 'abcd1234',
        remainingMs: 600000,
        startedAt: FIXED_NOW,
        duration: 30,
        unit: 'minute',
        updatedAt: FIXED_NOW
      })
      const raw = localStorage.getItem(`${ANSWER_TIME_KEY_PREFIX}abcd1234`)
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw!)
      expect(parsed.remainingMs).toBe(600000)
      expect(parsed.unit).toBe('minute')
    })

    it('reads back what was written', () => {
      write({
        surveyPath: 'pathA',
        remainingMs: 120000,
        startedAt: FIXED_NOW,
        duration: 2,
        unit: 'minute',
        updatedAt: FIXED_NOW
      })
      const r = read('pathA')
      expect(r).not.toBeNull()
      expect(r!.remainingMs).toBe(120000)
      expect(r!.duration).toBe(2)
      expect(r!.unit).toBe('minute')
    })

    it('returns null on miss', () => {
      expect(read('does-not-exist')).toBeNull()
    })

    it('returns null on corrupt payload', () => {
      localStorage.setItem(`${ANSWER_TIME_KEY_PREFIX}bad`, '{not json')
      expect(read('bad')).toBeNull()
    })

    it('isolates records across surveyPaths', () => {
      write({
        surveyPath: 'A',
        remainingMs: 1000,
        startedAt: FIXED_NOW,
        duration: 1,
        unit: 'second',
        updatedAt: FIXED_NOW
      })
      write({
        surveyPath: 'B',
        remainingMs: 60000,
        startedAt: FIXED_NOW,
        duration: 1,
        unit: 'minute',
        updatedAt: FIXED_NOW
      })
      expect(read('A')!.remainingMs).toBe(1000)
      expect(read('B')!.remainingMs).toBe(60000)
    })
  })

  describe('clear', () => {
    it('removes the record for a given surveyPath', () => {
      write({
        surveyPath: 'gone',
        remainingMs: 1,
        startedAt: 0,
        duration: 1,
        unit: 'minute',
        updatedAt: 0
      })
      clear('gone')
      expect(read('gone')).toBeNull()
    })

    it('does not error when clearing missing key', () => {
      expect(() => clear('never-existed')).not.toThrow()
    })
  })

  describe('init', () => {
    it('returns null when conf disabled', () => {
      expect(init('p', { enabled: false, duration: 30, unit: 'minute' })).toBeNull()
      expect(init('p', null)).toBeNull()
    })

    it('initializes a fresh record using duration × unit', () => {
      const rec = init('fresh', { enabled: true, duration: 30, unit: 'minute' })
      expect(rec).not.toBeNull()
      expect(rec!.remainingMs).toBe(30 * 60 * 1000)
      expect(rec!.unit).toBe('minute')
      expect(read('fresh')!.remainingMs).toBe(30 * 60 * 1000)
    })

    it('initializes seconds correctly', () => {
      const rec = init('s', { enabled: true, duration: 45, unit: 'second' })
      expect(rec!.remainingMs).toBe(45 * 1000)
    })

    it('preserves existing record when conf matches', () => {
      write({
        surveyPath: 'keep',
        remainingMs: 50000,
        startedAt: FIXED_NOW,
        duration: 30,
        unit: 'minute',
        updatedAt: FIXED_NOW
      })
      const rec = init('keep', { enabled: true, duration: 30, unit: 'minute' })
      expect(rec!.remainingMs).toBe(50000)
    })

    it('resets when conf duration / unit changed (B 端改配置后)', () => {
      write({
        surveyPath: 'reset',
        remainingMs: 50000,
        startedAt: FIXED_NOW,
        duration: 30,
        unit: 'minute',
        updatedAt: FIXED_NOW
      })
      const rec = init('reset', { enabled: true, duration: 60, unit: 'minute' })
      expect(rec!.duration).toBe(60)
      expect(rec!.remainingMs).toBe(60 * 60 * 1000)
    })
  })
})
