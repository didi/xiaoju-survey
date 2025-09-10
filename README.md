<div align=center>
  <p>
    <img src="https://img-hxy021.didistatic.com/static/starimg/img/j8lBA6yy201698840712358.jpg"  width="300" align='center' />
  </p>
  <div>
    <a href="https://github.com/didi/xiaoju-survey/graphs/contributors">
      <img src="https://img.shields.io/badge/node-%3E=18-green" alt="commit">
    </a>
    <a href="https://app.codecov.io/github/didi/xiaoju-survey">
      <img src="https://img.shields.io/codecov/c/github/didi/xiaoju-survey" alt="codecov">
    </a>
    <a href="https://github.com/didi/xiaoju-survey/issues">
      <img src="https://img.shields.io/github/issues/didi/xiaoju-survey" alt="issues">
    </a>
    <a href="https://github.com/didi/xiaoju-survey/graphs/contributors">
      <img src="https://img.shields.io/github/last-commit/didi/xiaoju-survey?color=red" alt="commit">
    </a>
    <a href="https://github.com/didi/xiaoju-survey/pulls">
      <img src="https://img.shields.io/badge/PRs-welcome-%23ffa600" alt="pr">
    </a>
    <a href="https://xiaojusurvey.didi.cn">
      <img src="https://img.shields.io/badge/help-%E5%AE%98%E7%BD%91-blue" alt="docs">
    </a>
    <a href="https://github.com/didi/xiaoju-survey/blob/main/README_EN.md">
      <img src="https://img.shields.io/badge/help-README_EN-50c62a" alt="docs">
    </a>
  </div>
</div>

<br />

&ensp;&ensp;**XIAOJUSURVEY**是一套轻量、安全的调研系统，提供面向个人和企业的一站式产品级解决方案，用于构建各类问卷、考试、测评和复杂表单，快速满足各类线上调研场景。

&ensp;&ensp;内部系统已沉淀 40+种题型，累积精选模板 100+，适用于市场调研、客户满意度调研、在线考试、投票、报道、测评等众多场景。数据能力上，经过上亿量级打磨，沉淀了分题统计、交叉分析、多渠道分析等在线报表能力，快速满足专业化分析。

# 功能特性

**🌈 易用**

- 多类型数据采集，轻松创建调研表单：文本输入、数据选择、评分、投票、文件上传等。

- 智能逻辑编排，设计多规则动态表单：显示逻辑、跳转逻辑、选项引用、题目引用等。

- 精细权限管理，支持高效团队协同：空间管理、多角色权限管理等。

- 数据在线分析和导出，洞察调研结果：数据导出、回收数据管理、分题统计、交叉分析等。

- AI 生成问卷，支持一键接入LLM：对话式生成问卷，实时预览更快速。

**🎨 好看**

- 主题自由定制，适配您的品牌：自定义颜色、背景、图片、Logo、结果页规则等。

- 无缝嵌入各终端，满足不同场景需求：多端嵌入式小问卷 SDK。

**🚀 安全、可扩展**

- 安全能力可扩展，提供安全相关建设的经验指导：传输加密、敏感词库、发布审查等。

- 自定义 Hook 配置，轻松集成多方系统与各类工具：数据推送集成、消息推送集成等。

<img src="https://github.com/didi/xiaoju-survey/assets/16012672/dd427471-368d-49d9-bc44-13c34d84e3be"  width="700" />

1、 **全部功能**请查看 [功能介绍](https://xiaojusurvey.didi.cn/docs/next/document/%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8C/%E5%8A%9F%E8%83%BD%E4%BB%8B%E7%BB%8D/%E5%9F%BA%E7%A1%80%E6%B5%81%E7%A8%8B)。

2、**企业**和**个人**均可快速构建特定领域的调研类解决方案。

# 技术

**1、Web 端：Vue3 + ElementPlus**

&ensp;&ensp;C 端多端渲染：ReactNative SDK 建设中

**2、Server 端：NestJS + MongoDB**

&ensp;&ensp;Java 版：建设中，[欢迎加入共建](https://github.com/didi/xiaoju-survey/issues/306)

**3、能力增强**

&ensp;&ensp;智能化问卷：规划中

# 项目优势

**一、具备全面的综合性和专业性**

- [制定了问卷标准化协议规范](https://xiaojusurvey.didi.cn/docs/next/agreement/%E3%80%8A%E9%97%AE%E5%8D%B7Meta%E5%8D%8F%E8%AE%AE%E3%80%8B)

  领域标准保障概念互通，是全系统的基础和核心。基于实际业务经验，沉淀了两大类：

  - 业务描述：问卷协议、题型协议
  - 物料描述：题型物料协议，包含题型和设置器

- [制定了问卷 UI/UX 规范](https://xiaojusurvey.didi.cn/docs/next/design/%E3%80%8A%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83%E3%80%8B)

  设计语言是系统灵活性、一致性的基石，保障系统支撑的实际业务运转拥有极高的用户体验。包含两部分：

  - 设计规范：灵活、降噪、统一
  - 交互规范：遵循用户行为特征，遵循产品定位，遵循成熟的用户习惯

- [所见即所得，搭建渲染一致性高](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%A2%98%E5%9E%8B%E5%9C%BA%E6%99%AF%E5%8C%96%E8%AE%BE%E8%AE%A1)

  实际业务使用上包含问卷生成和投放使用，即对于系统的搭建端和渲染端。我们将题型场景化设计，以满足一份问卷从加工生产到投放应用的高度一致。

- [题型物料化设计，自由定制扩展](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%A2%98%E5%9E%8B%E7%89%A9%E6%96%99%E5%8C%96%E8%AE%BE%E8%AE%A1/%E5%9F%BA%E7%A1%80%E8%AE%BE%E8%AE%A1)

  题型是问卷最核心的组成部分，而题型可配置化能力决定了上层业务可扩展的场景以及系统自身可复用的场景。
  题型架构设计上，主打每一类题型拥有通用基础能力，每一种题型拥有原子化特性能力，并保障高度定制化。

- [合规建设沉淀积累，安全能力拓展性高](https://xiaojusurvey.didi.cn/docs/next/document/%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1/%E6%A6%82%E8%BF%B0)

  数据加密传输、敏感信息精细化检测、投票防刷等能力，保障问卷发布、数据回收链路安全性。

**二、轻量化设计，快速接入、灵活扩展**

- [产品级开源方案，快速产出一套调研流程](https://xiaojusurvey.didi.cn/docs/next/document/%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8C/%E6%A6%82%E8%BF%B0)

  围绕问卷生命周期提供了完整的产品化能力，包含用户管理: 登录、注册、问卷权限，问卷管理: 创、编、投、收、数据分析，可快速构建特定领域的调研类解决方案。

- [问卷设计开箱即用，降低领域复杂度](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%97%AE%E5%8D%B7%E6%90%AD%E5%BB%BA%E9%A2%86%E5%9F%9F%E5%8C%96%E8%AE%BE%E8%AE%A1)

  问卷组成具有高灵活性，此业务特征带来问卷编辑能力的高复杂性设计。我们将问卷编辑划分为五大子领域，进行产品能力聚类，同时指导系统模块化设计和开发。基于模块编排和管理，能够开箱即用。

- [二次开发成本低，轻松定制专属调研系统](https://xiaojusurvey.didi.cn/docs/next/document/%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C/%E5%B7%A5%E7%A8%8B%E9%85%8D%E7%BD%AE%E5%8C%96)

  全系统设计原则基于协议标准化、功能模块化、管理配置化，并提供了一些列完整的文档和开发及扩展手册。

- [部署成本低，快速上线](https://xiaojusurvey.didi.cn/docs/next/document/%E5%B7%A5%E7%A8%8B%E9%83%A8%E7%BD%B2/Docker%E9%83%A8%E7%BD%B2)

  前后端分离，提供 Docker 化方案，提供了完善的部署指导手册。


# 本地开发

请查看 [本地安装手册](https://xiaojusurvey.didi.cn/docs/next/document/%E6%A6%82%E8%BF%B0/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B) 来启动项目。

```
// 服务启动
cd server
npm install
npm run local

// 页面启动
cd web
npm install
npm run serve

// B端 http://localhost:8080/management

// C端 http://localhost:8080/render/:surveyPath
```

# 快速部署

### 服务部署

请查看 [部署指导](https://xiaojusurvey.didi.cn/docs/next/document/%E5%B7%A5%E7%A8%8B%E9%83%A8%E7%BD%B2/Docker%E9%83%A8%E7%BD%B2) 。

#### Docker 镜像版本选择

我们提供两个 Docker 镜像版本供您选择：

- **slim 版本** (`xiaojusurvey/xiaoju-survey:latest-slim`): 
  - 基于 `node:18-slim`，镜像体积更小
  - 适合生产环境部署
  - 包含运行所需的最小依赖

- **完整版本** (`xiaojusurvey/xiaoju-survey:latest-full`):
  - 基于 `node:18`，包含完整的开发工具
  - 适合开发环境或需要调试的场景
  - 包含 `curl`、`vim`、`git` 等工具

在 `docker-compose.yaml` 中修改镜像标签即可切换版本。

### 一键部署

_（手册编写中）_

<br />

## Star

开源不易，如果该项目对你有帮助，请 star 一下 ❤️❤️❤️，你的支持是我们最大的动力。

[![Star History Chart](https://api.star-history.com/svg?repos=didi/xiaoju-survey&type=Date)](https://star-history.com/#didi/xiaoju-survey&Date)

## 交流群

官方群会发布项目最新消息、建设计划和社区活动，欢迎你的加入。

<img src="https://img-hxy021.didistatic.com/static/starimg/img/KXKvc7sjHz1700061188156.png"  width="200" />

_任何问题和合作可以联系小助手。_

## 案例

如果你使用了该项目，请记录反馈：[我在使用](https://github.com/didi/xiaoju-survey/issues/64)，你的支持是我们最大的动力。

## Future Tasks

[欢迎了解项目发展和共建](https://github.com/didi/xiaoju-survey/issues/85)，你的支持是我们最大的动力。

## 贡献

如果你想成为贡献者或者扩展技术栈，请查看：[贡献者指南](https://xiaojusurvey.didi.cn/docs/next/share/%E5%A6%82%E4%BD%95%E5%8F%82%E4%B8%8E%E8%B4%A1%E7%8C%AE)，你的加入使我们最大的荣幸。

## CHANGELOG

关注项目重大变更：[MAJOR CHANGELOG](https://github.com/didi/xiaoju-survey/issues/48)。
