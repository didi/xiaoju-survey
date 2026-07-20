import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import TimeLimitConfig from '../TimeLimitConfig.vue'

// element-plus 的 ElMessage 在 jsdom 下需要 mock，避免真实挂载
vi.mock('element-plus', () => ({
  ElMessage: { warning: vi.fn() }
}))
vi.mock('element-plus/theme-chalk/src/base.scss', () => ({}))
vi.mock('element-plus/theme-chalk/src/message.scss', () => ({}))

const FORM_CHANGE = 'form-change'

const factory = (formConfig: any, moduleConfig: any = {}) =>
  mount(TimeLimitConfig, {
    props: { formConfig, moduleConfig },
    global: {
      stubs: {
        'el-switch': true,
        'el-input-number': true,
        'el-select': true,
        'el-option': true
      }
    }
  })

const limitConf = (over: any = {}) => ({
  key: 'answerTimeLimit',
  value: { enabled: true, duration: 30, unit: 'minute', ...over }
})

const emittedOf = (w: any) => (w.emitted()[FORM_CHANGE] || []) as any[]

describe('TimeLimitConfig — 默认值（defaultDuration 回退）', () => {
  it('answerMinDuration 无值时按 defaultDuration=10 回退（不再固定 30）', async () => {
    const w = factory({ key: 'answerMinDuration', defaultDuration: 10 })
    expect((w.vm as any).duration).toBe(10)
  })

  it('未声明 defaultDuration 时回退到 30', async () => {
    const w = factory({ key: 'answerTimeLimit' })
    expect((w.vm as any).duration).toBe(30)
  })
})

describe('TimeLimitConfig — 切换单位保留原值、不提示（SUR-37 反转 CL-018）', () => {
  it('切换单位时 duration 保持原值不变', async () => {
    const w = factory(limitConf())
    expect((w.vm as any).duration).toBe(30)
    ;(w.vm as any).handleUnitChange('second')
    expect((w.vm as any).duration).toBe(30)
  })

  it('切换单位后校验通过即向上 emit（携带原数值 + 新单位）', async () => {
    const w = factory(limitConf())
    ;(w.vm as any).handleUnitChange('second')
    expect((w.vm as any).errorMsg).toBe('')
    const emitted = emittedOf(w)
    expect(emitted.length).toBe(1)
    expect(emitted[0][0]).toMatchObject({
      key: 'answerTimeLimit',
      value: { enabled: true, duration: 30, unit: 'second' }
    })
  })

  it('空态 blur 不再在保存侧 validate，按当前值向上 emit', async () => {
    const w = factory(limitConf())
    ;(w.vm as any).duration = null
    ;(w.vm as any).handleDurationBlur()
    expect((w.vm as any).duration).toBeNull()
    expect((w.vm as any).errorMsg).toBe('')
    const emitted = emittedOf(w)
    expect(emitted.length).toBe(1)
    expect(emitted[0][0]).toMatchObject({
      key: 'answerTimeLimit',
      value: { enabled: true, duration: null, unit: 'minute' }
    })
  })
})

describe('TimeLimitConfig — 最短时长与限时关系不阻断保存（2026-07-17）', () => {
  it('最短时长 ≥ 答题限时（同单位）仍通过并 emit', async () => {
    const w = factory(
      { key: 'answerMinDuration', value: { enabled: true, duration: 30, unit: 'minute' } },
      { answerTimeLimit: { enabled: true, duration: 30, unit: 'minute' } }
    )
    ;(w.vm as any).handleDurationBlur()
    expect((w.vm as any).errorMsg).toBe('')
    expect(emittedOf(w).length).toBe(1)
  })

  it('跨单位归一化后最短时长大于限时，也不报跨字段错误', async () => {
    const w = factory(
      { key: 'answerMinDuration', value: { enabled: true, duration: 2, unit: 'minute' } },
      { answerTimeLimit: { enabled: true, duration: 30, unit: 'second' } }
    )
    ;(w.vm as any).handleDurationBlur()
    expect((w.vm as any).errorMsg).toBe('')
    expect(emittedOf(w).length).toBe(1)
  })

  it('从限时侧编辑：限时 ≤ 最短 时仍通过并 emit', async () => {
    const w = factory(
      { key: 'answerTimeLimit', value: { enabled: true, duration: 10, unit: 'minute' } },
      { answerMinDuration: { enabled: true, duration: 10, unit: 'minute' } }
    )
    ;(w.vm as any).handleDurationBlur()
    expect((w.vm as any).errorMsg).toBe('')
    expect(emittedOf(w).length).toBe(1)
  })
})
