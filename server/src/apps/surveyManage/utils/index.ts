import { SURVEY_STATUS, CommonError } from '../../../types/index'
import { hex2Base58 } from './base58'
import * as Joi  from 'joi'

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

export function genSurveyPath() {
  return hex2Base58(process.hrtime.bigint().toString(16))
}

export function getMapByKey({data,key}:{data:Array<any>,key:string}) {
  const datamap = {}
  for(const item of data) {
    datamap[item[key]] = item
  }
  return datamap
}

export function hanleSensitiveDate(value:string = ''): string {
  if (!value) {
    return '*'
  }

  let str = '' + value
  if (str.length === 1) {
    str = '*'
  }
  if (str.length === 2) {
    str = str[0] + '*'
  }
  if (str.length >= 3) {
    str = str[0] + '***' + str.slice(str.length - 1)
  }
  return str
}