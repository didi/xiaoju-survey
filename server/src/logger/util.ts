import { customAlphabet } from 'nanoid';
const traceIdAlphabet = 'abcdef0123456789';

let count = 0;

const getCountStr = () => {
  count++;
  return count.toString().padStart(8, '0');
};

const getRandom = customAlphabet(traceIdAlphabet, 10);

export const genTraceId = (): string => {
  return getRandom() + Math.round(Date.now() / 1000).toString() + getCountStr();
};
