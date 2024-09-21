export const getUserInfo = (): any => {
  try {
    return JSON.parse(localStorage.getItem('surveyUserInfo') as string) || {}
  } catch (e) {
    console.log(e)
  }

  return {}
}

export const setUserInfo = (params: { userInfo: any; loginTime: any }) => {
  const { userInfo, loginTime } = params
  localStorage.setItem(
    'surveyUserInfo',
    JSON.stringify({
      userInfo,
      loginTime
    })
  )
}

export const clearUserInfo = () => localStorage.removeItem('surveyUserInfo')
