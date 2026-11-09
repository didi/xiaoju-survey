import { describe, expect, it, vi } from 'vitest'
import { textToSchema } from './textToSchema'

vi.mock('@/materials/questions/questionLoader', async () => {
  const { meta } = await import('@/materials/questions/widgets/InputModule/meta')
  return {
    default: {
      init: vi.fn(),
      getMeta: (type: string) => type === 'text' ? meta : {}
    }
  }
})

describe('textToSchema', () => {
  it.each(['未知题型', 'toString', '__proto__'])('skips unsupported type %s', (type) => {
    const questions = textToSchema(`before[单行输入框]\n\nskip[${type}]\n\nafter[单行输入框]`)

    expect(questions.map((question) => question.title)).toEqual(['before', 'after'])
    expect(questions.every((question) => question.type === 'text')).toBe(true)
  })

  it('preserves the showIndex option for supported questions', () => {
    const [question] = textToSchema('title[单行输入框]', { showIndex: false })

    expect(question.title).toBe('title')
    expect(question.showIndex).toBe(false)
  })
})
