// 用于记录“问卷断点续答”的数据
export const getSurveyData = (id: string): any => {
  try {
    return JSON.parse(localStorage.getItem(`${id}_questionData`) as string) || null
  } catch (e) {
    console.log(e)
  }

  return null
}
export const setSurveyData = (id: string, formData: any = {}) => {
  localStorage.setItem(`${id}_questionData`, JSON.stringify(formData))
}
export const clearSurveyData = (id: string) => localStorage.removeItem(`${id}_questionData`)

// 问卷是否提交过，用于“自动填充上次填写内容”
export const getSurveySubmit = (id: string): number => {
  try {
    return Number(JSON.parse(localStorage.getItem(`${id}_submit`) as string)) || 0
  } catch (e) {
    console.log(e)
  }

  return 0
}
export const setSurveySubmit = (id: string, value: number) => {
  localStorage.setItem(`${id}_submit`, JSON.stringify(value))
}
export const clearSurveySubmit = (id: string) => localStorage.removeItem(`${id}_submit`)

// 投票记录
export const getVoteData = (): any => {
  try {
    return JSON.parse(localStorage.getItem('voteData') as string) || null
  } catch (e) {
    console.log(e)
  }

  return null
}
export const setVoteData = (params: any) => {
  localStorage.setItem('voteData', JSON.stringify(params))
}
export const clearVoteData = () => localStorage.removeItem('voteData')
