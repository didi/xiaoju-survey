const phoneRegex = /^1[3456789]\d{9}$/; // 手机号码正则表达式
const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; // 身份证号码正则表达式
const addressRegex = /.*省|.*自治区|.*市|.*区|.*镇|.*县/; // 地址正则表达式
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 邮箱正则
const genderArr = ['男', '女']; // 性别
const nameRegex = /^([\u4e00-\u9fa5]{1,6}|[a-zA-Z.\s]{1,20})$/; // 只能识别是否包含中文，无法识别是否是姓名，暂时不启用


export const isPhone = data => phoneRegex.test(data);

export const isIdCard = data => idCardRegex.test(data);

export const isAddress = data => addressRegex.test(data);

export const isEmail = data => emailRegex.test(data);

export const isGender = data => genderArr.includes(data);

export const isName = data => nameRegex.test(data);