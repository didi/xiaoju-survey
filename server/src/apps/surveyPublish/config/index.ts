import { mongo, session, encrypt } from '../../../config';

export function getConfig() {
  return {
    mongo,
    session,
    encrypt,
  };
}