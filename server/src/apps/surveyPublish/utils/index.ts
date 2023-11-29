import { SURVEY_STATUS, CommonError } from '../../../types/index'
import * as Joi  from 'joi'

export function getMapByKey({data,key}:{data:Array<any>,key:string}) {
  const datamap = {}
  for(const item of data) {
    datamap[item[key]] = item
  }
  return datamap
}

export function getStatusObject({status}:{status:SURVEY_STATUS}) {
  return {
    status,
    id: status,
    date: Date.now(),
  };
}
export function getValidateValue<T=any>(validationResult:Joi.ValidationResult<T>):T {
  if(validationResult.error) {
    throw new CommonError(validationResult.error.details.map(e=>e.message).join())
  }
  return validationResult.value;
}

export function randomCode(length) {
  let charList:Array<string> = []
  for(let i=0;i<length;i++) {
    charList.push(Math.floor(Math.random()*16).toString(16))
  }
  return charList.join('')
}