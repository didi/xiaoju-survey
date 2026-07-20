import {
  AnswerDurationConf,
  AnswerTimeUnit,
  BaseConf,
} from 'src/interfaces/survey';

const DEFAULT_DURATION = 30;
const VALID_UNITS: AnswerTimeUnit[] = ['minute', 'second'];

function normalizeUnit(unit: any): AnswerTimeUnit {
  return VALID_UNITS.includes(unit) ? unit : 'minute';
}

function normalizeDuration(duration: any): number {
  if (
    typeof duration !== 'number' ||
    !Number.isFinite(duration) ||
    !Number.isInteger(duration) ||
    duration <= 0
  ) {
    return DEFAULT_DURATION;
  }
  return duration;
}

export function normalizeAnswerDurationConf(
  conf: any,
): AnswerDurationConf | undefined {
  if (conf === undefined || conf === null) return undefined;
  if (typeof conf !== 'object') return undefined;
  return {
    enabled: conf.enabled === true,
    duration: normalizeDuration(conf.duration),
    unit: normalizeUnit(conf.unit),
  };
}

export function normalizeBaseConfAnswerTime(
  baseConf: BaseConf | undefined,
): void {
  if (!baseConf) return;
  if (baseConf.answerTimeLimit !== undefined) {
    baseConf.answerTimeLimit = normalizeAnswerDurationConf(
      baseConf.answerTimeLimit,
    );
  }
  if (baseConf.answerMinDuration !== undefined) {
    baseConf.answerMinDuration = normalizeAnswerDurationConf(
      baseConf.answerMinDuration,
    );
  }
}
