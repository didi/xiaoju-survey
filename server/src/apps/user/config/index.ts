import { mongo, jwt } from '../../../config';

export function getConfig() {
  return {
    mongo,
    jwt,
  };
}