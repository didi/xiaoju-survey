import { SURVEY_STATUS, CommonError } from '../../../types/index';
import { hex2Base58 } from './base58';
import * as Joi from 'joi';
import * as fs from 'fs';

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

export function genSurveyPath() {
  return hex2Base58(process.hrtime.bigint().toString(16));
}

export const getFile = function(path, { encoding }: { encoding } = { encoding: 'utf-8' }): Promise<string> {
  return new Promise((resolve, reject) => {

    fs.stat(path, err => {
      if (!err) {
        fs.readFile(path, { encoding }, (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data.toString());
          }
        });
      } else {
        reject(err);
      }
    });
  });

};