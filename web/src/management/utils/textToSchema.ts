import { getMultiOptionByText } from "@/materials/questions/common/utils";
import { getQuestionByType } from ".";
import { typeTagLabels, QUESTION_TYPE } from "@/common/typeEnum";
const textTypeMap = (Object.keys(typeTagLabels) as Array<QUESTION_TYPE>).reduce((pre, key) => {
  const label = typeTagLabels[key]
  pre[label] = key
  return pre
}, {} as Record<string, string>)
export const textToSchema = (text: string, options: { showIndex?: boolean } = {}) => {
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

    const question: Record<string, any> = getQuestionByType(textTypeMap[type]);
    question.title = title
    question.showIndex = options.showIndex ?? true  // 改为从配置读取
    // question.showIndex = false
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
