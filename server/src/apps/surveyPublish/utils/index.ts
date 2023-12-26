import { SURVEY_STATUS, CommonError } from '../../../types/index';
import * as Joi from 'joi';

export function getStatusObject({ status }: { status: SURVEY_STATUS }) {
  return {
    status,
    id: status,
    date: Date.now(),
  };
}
export function getValidateValue<T = unknown>(validationResult: Joi.ValidationResult<T>): T {
  if (validationResult.error) {
    throw new CommonError(validationResult.error.details.map(e => e.message).join());
  }
  return validationResult.value;
}

export function randomCode(length) {
  const charList: Array<string> = [];
  for (let i = 0; i < length; i++) {
    charList.push(Math.floor(Math.random() * 16).toString(16));
  }
  return charList.join('');
}