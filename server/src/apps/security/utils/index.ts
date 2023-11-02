import { CommonError } from '../types/index'

export function participle({ content, minLen, maxLen }: { content: string, minLen?: number, maxLen?: number }) {
    const keys: Array<string> = []
    minLen = minLen || 2
    maxLen = maxLen || 13
    for (let i = 0; i < content.length; i++) {
        let tempStr = content[i]
        for (let j = 1; j < maxLen && i + j < content.length; j++) {
            tempStr += content[i + j]
            if (j >= minLen - 1) {
                keys.push(tempStr)
            }
        }
    }
    return keys
}