import fs, { promises as fsa } from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

interface PackageJson {
  type?: string;
  name?: string;
  version?: string;
  description?: string;
  id?: string;
  msg?: string;
}

const getId = () => {
  const id = new Date().getTime().toString();
  process.env.XIAOJU_SURVEY_REPORT_ID = id;

  return id;
};

const readData = async (directory: string): Promise<PackageJson | null> => {
  const packageJsonPath = path.join(directory, 'package.json');
  const id = process.env.XIAOJU_SURVEY_REPORT_ID || getId();
  try {
    if (!fs.existsSync(directory)) {
      return {
        type: 'server',
        name: '',
        version: '',
        description: '',
        id,
        msg: '文件不存在',
      };
    }
    const data = await fsa.readFile(packageJsonPath, 'utf8').catch((e) => e);
    const { name, version, description } = JSON.parse(data) as PackageJson;
    return { type: 'server', name, version, description, id };
  } catch (error) {
    return error;
  }
};

(async (): Promise<void> => {
  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.XIAOJU_SURVEY_REPORT
  ) {
    return;
  }

  const res = await readData(path.join(process.cwd()));

  // 上报
  fetch('https://xiaojusurveysrc.didi.cn/reportSourceData', {
    method: 'POST',
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(res),
  }).catch(() => {});
})();
