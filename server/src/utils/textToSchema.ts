import { getMultiOptionByText } from "./index";
import { getQuestionByType } from "./index";
import { typeTagLabels, QUESTION_TYPE } from "./typeEnum";
const textTypeMap = (Object.keys(typeTagLabels) as Array<QUESTION_TYPE>).reduce((pre, key) => {
  const label = typeTagLabels[key]
  pre[label] = key
  return pre
}, {} as Record<string, string>)
export const textToSchema = (text: string) => {
  text = text.replace(/\r\n/g, '\n')   // Windows CRLF → LF
           .replace(/\r/g, '\n')     // 老 Mac CR → LF（可选）
           .trim();

  const blocks = text.trim().split(/\n\s*\n/);
  const questions = []

  for (const block of blocks) {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // 解析标题和题型
    const firstLine = lines[0];
    const match = firstLine.match(/^(.*?)\[(.+?)\]$/);
    if (!match) continue;

    const title = match[1].trim();
    const type = match[2].trim();
    const content = lines.slice(1);

    const enumKey = textTypeMap[type];
    if (!enumKey) {
      throw new Error(`Unrecognized question type: "${type}"`);
    }
    console.debug(`解析题型 "${type}" → 枚举 key = ${enumKey}`);
    const question: Record<string, any> = getQuestionByType(enumKey);
    question.title = title
    question.showIndex = true

    // 根据类型创建题目对象
    switch (type) {
      case "单行输入框":
      case "多行输入框":
      case "评分":
      case "多级联动":
        questions.push(question);
        break;

      case "单选":
      case "多选":
      case "投票":
      case "判断题": {
        const options = getMultiOptionByText(content.join('\n'))
        question.options = options;
        questions.push(question);
        break;
      }

      case "NPS评分": {
        if (content.length > 0 && content[0].includes('-')) {
          const [left = '', right = ''] = content[0].split('-');
          question.minMsg = left;
          question.maxMsg = right;
        }
        questions.push(question);
        break;
      }

      default:
        break;
    }
  }

  return questions;
}
