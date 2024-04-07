import { customAlphabet } from 'nanoid';

const surveyPathAlphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function genSurveyPath({ size, prefix } = { size: 8, prefix: '' }) {
  size = Number(size) ? Number(size) : 8;
  const id = customAlphabet(`${prefix || ''}${surveyPathAlphabet}`, size);
  return id();
}
