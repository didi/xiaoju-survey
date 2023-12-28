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