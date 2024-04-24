import { promisify } from 'util';
import { randomBytes } from 'crypto';

export const generateUniqueFilename = async (
  originalname: string,
): Promise<string> => {
  const randomBytesPromise = promisify(randomBytes);
  const randomString = (await randomBytesPromise(16)).toString('hex');
  const ext = originalname.split('.').pop();
  return `${randomString}.${ext}`;
};
