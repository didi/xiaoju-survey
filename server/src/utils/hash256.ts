import { createHash } from 'crypto';

export function hash256(text) {
  return createHash('sha256').update(text).digest('hex');
}
