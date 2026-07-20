import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CountdownHeader from '../components/CountdownHeader.vue'

const FIXED_NOW = 1_700_000_000_000

describe('CountdownHeader (CL-013 / CL-014)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(FIXED_NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('display format', () => {
    it('shows mm:ss in minute mode', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 30,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 30 * 60 * 1000,
          active: true
        }
      })
      expect(wrapper.text()).toBe('倒计时 30:00')
    })

    it('shows ss only in second mode', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 45,
          unit: 'second',
          startedAt: FIXED_NOW,
          initialRemainingMs: 45 * 1000,
          active: true
        }
      })
      expect(wrapper.text()).toBe('倒计时 45')
    })

    it('uses 3-digit minutes when total ≥100 minutes', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 120,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 120 * 60 * 1000,
          active: true
        }
      })
      expect(wrapper.text()).toBe('倒计时 120:00')
    })

    it('zero-pads single-digit minutes/seconds', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 5,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 5 * 60 * 1000 + 9 * 1000,
          active: true
        }
      })
      expect(wrapper.text()).toBe('倒计时 05:09')
    })

    it('renders nothing when not active', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 30,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 30 * 60 * 1000,
          active: false
        }
      })
      expect(wrapper.find('.countdown-header').exists()).toBe(false)
    })
  })

  describe('tick / expire', () => {
    it('emits tick on every interval', async () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 1,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 60 * 1000,
          active: true
        }
      })
      vi.setSystemTime(FIXED_NOW + 1000)
      vi.advanceTimersByTime(1000)
      await flushPromises()
      const ticks = wrapper.emitted('tick')
      expect(ticks).toBeTruthy()
      expect(ticks!.length).toBeGreaterThan(0)
    })

    it('emits expire when remaining reaches 0', async () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 1,
          unit: 'second',
          startedAt: FIXED_NOW,
          initialRemainingMs: 1000,
          active: true
        }
      })
      vi.setSystemTime(FIXED_NOW + 1000)
      vi.advanceTimersByTime(1000)
      await flushPromises()
      expect(wrapper.emitted('expire')).toBeTruthy()
    })

    it('emits expire immediately on mount when initial already 0', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 1,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 0,
          active: true
        }
      })
      expect(wrapper.emitted('expire')).toBeTruthy()
    })
  })

  describe('warn class', () => {
    it('applies is-warn when remainingSec ≤ 30', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 30,
          unit: 'second',
          startedAt: FIXED_NOW,
          initialRemainingMs: 30 * 1000,
          active: true
        }
      })
      expect(wrapper.find('.countdown-header').classes()).toContain('is-warn')
    })

    it('does not apply is-warn when remainingSec > 30', () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 5,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 5 * 60 * 1000,
          active: true
        }
      })
      expect(wrapper.find('.countdown-header').classes()).not.toContain('is-warn')
    })
  })

  describe('visibilitychange recalibration', () => {
    it('recalculates remaining via real time when tab becomes visible (expire path)', async () => {
      const wrapper = mount(CountdownHeader, {
        props: {
          duration: 1,
          unit: 'minute',
          startedAt: FIXED_NOW,
          initialRemainingMs: 60 * 1000,
          active: true
        }
      })
      // 模拟切到后台 90s 后回到前台（已超时）
      vi.setSystemTime(FIXED_NOW + 90 * 1000)
      Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        get: () => 'visible'
      })
      document.dispatchEvent(new Event('visibilitychange'))
      await flushPromises()
      expect(wrapper.emitted('expire')).toBeTruthy()
    })
  })
})
