import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AnswerTimeLimitDialog from '../components/AnswerTimeLimitDialog.vue'

const factory = (props: Record<string, unknown>) =>
  mount(AnswerTimeLimitDialog, {
    props: {
      visible: true,
      duration: 30,
      unit: 'minute',
      remainingMs: 30 * 60 * 1000,
      ...props
    }
  })

describe('AnswerTimeLimitDialog (CL-012 / CL-015)', () => {
  describe('minute unit', () => {
    it('shows X=Y copy when remaining equals total', () => {
      const wrapper = factory({
        duration: 30,
        unit: 'minute',
        remainingMs: 30 * 60 * 1000
      })
      const text = wrapper.find('.content').text()
      expect(text).toContain('本次问卷填写限时 30 分钟')
      expect(text).not.toContain('剩余答题时长')
    })

    it('shows X=Y copy when remainingMs > totalMs (defensive)', () => {
      const wrapper = factory({
        duration: 30,
        unit: 'minute',
        remainingMs: 31 * 60 * 1000
      })
      expect(wrapper.find('.content').text()).not.toContain('剩余答题时长')
    })

    it('shows X<Y copy when 1min ≤ remaining < total', () => {
      const wrapper = factory({
        duration: 30,
        unit: 'minute',
        remainingMs: 5 * 60 * 1000
      })
      const text = wrapper.find('.content').text()
      expect(text).toContain('限时 30 分钟')
      expect(text).toContain('剩余答题时长 5 分钟')
    })

    it('shows X<1min copy when remaining < 60s in minute mode', () => {
      const wrapper = factory({
        duration: 30,
        unit: 'minute',
        remainingMs: 30 * 1000
      })
      const text = wrapper.find('.content').text()
      expect(text).toContain('剩余答题时长不足 1 分钟')
    })
  })

  describe('second unit (CL-015 — no <1sec branch)', () => {
    it('shows X=Y copy when remaining equals total in seconds', () => {
      const wrapper = factory({
        duration: 60,
        unit: 'second',
        remainingMs: 60 * 1000
      })
      const text = wrapper.find('.content').text()
      expect(text).toContain('限时 60 秒')
      expect(text).not.toContain('剩余答题时长')
    })

    it('shows X<Y copy with seconds remaining', () => {
      const wrapper = factory({
        duration: 60,
        unit: 'second',
        remainingMs: 25 * 1000
      })
      const text = wrapper.find('.content').text()
      expect(text).toContain('限时 60 秒')
      expect(text).toContain('剩余答题时长 25 秒')
    })

    it('does NOT use the <1 minute branch for sub-second remaining', () => {
      const wrapper = factory({
        duration: 60,
        unit: 'second',
        remainingMs: 500
      })
      const text = wrapper.find('.content').text()
      expect(text).not.toContain('不足 1 分钟')
      expect(text).toContain('秒')
    })
  })

  describe('handleStart', () => {
    it('emits start then close on click', async () => {
      const wrapper = factory({})
      await wrapper.find('.btn-dark').trigger('click')
      expect(wrapper.emitted('start')).toBeTruthy()
      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('visibility', () => {
    it('does not render mask when visible=false', () => {
      const wrapper = factory({ visible: false })
      expect(wrapper.find('.mask').exists()).toBe(false)
    })
  })
})
