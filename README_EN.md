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
      <img src="https://img.shields.io/badge/help-website-blue" alt="docs">
    </a>
    <a href="https://github.com/didi/xiaoju-survey/blob/main/README.md">
      <img src="https://img.shields.io/badge/help-README_ZH-50c62a" alt="docs">
    </a>
  </div>
</div>

<br />

&ensp;&ensp;XIAOJUSURVEY is a lightweight, secure questionnaire system foundation that provides one-stop product-level solutions for individuals and enterprises, quickly meeting various online survey scenarios.

&ensp;&ensp;The internal system has accumulated over 40 question types and more than 100 selected templates, suitable for market research, customer satisfaction surveys, online exams, voting, reporting, evaluations, and many other scenarios. In terms of data capabilities, it has been honed through hundreds of millions of iterations, resulting in the ability to provide online reports with per-question statistics, cross-analysis, and multi-channel analysis, quickly meeting professional analysis needs.

&ensp;&ensp;The open-source project focuses on building a survey foundation, constructing around platform capabilities, engineering structure, and development systems, allowing everyone to 「quickly」 create their own 「exclusive」 questionnaire system: [quickly understanding the ecological development philosophy](https://xiaojusurvey.didi.cn/docs/next/community/%E7%94%9F%E6%80%81%E5%BB%BA%E8%AE%BE).

# Function Overview

- Questionnaire Management: Create, edit, distribute, collect, data analysis.

- Diverse Question Types: Single-line input, multi-line input, single choice, multiple choice, true/false, rating, voting, etc.

- User Management: Login, registration, permissions management.

- Data Security: Encrypted transmission, data masking, etc.

> For more comprehensive features, please refer to the official Feature documentation.

<img src="https://github.com/didi/xiaoju-survey/assets/16012672/508ce30f-0ae8-4f5f-84a7-e96de8238a7f"  width="700" />

_**(Both individual and enterprise users can quickly build survey solutions specific to their fields.)**_

# Technology

Web: Vue3 + ElementPlus; Multi-end rendering for C-end (planning).

Server: Nestjs + MongoDB; Java ([under construction](https://github.com/didi/xiaoju-survey/issues/306)).

Intelligent Foundation: (planning).

# Project Advantages

**1. Comprehensive and Professional**

- [Standardized Protocols for Questionnaires](https://xiaojusurvey.didi.cn/docs/next/agreement/%E3%80%8A%E9%97%AE%E5%8D%B7Meta%E5%8D%8F%E8%AE%AE%E3%80%8B)

Ensuring concept interoperability is the foundation and core of the entire system. Based on practical business experience, two main categories have been established:

Business Descriptions: Questionnaire protocol, question type protocol.

Material Descriptions: Question type material protocol, including question types and settings.

- [UI/UX Standardization for Questionnaires](https://xiaojusurvey.didi.cn/docs/next/design/%E3%80%8A%E8%AE%BE%E8%AE%A1%E8%A7%84%E8%8C%83%E3%80%8B)

The design language is the cornerstone of system flexibility and consistency, ensuring the system supports actual business operations with high user experience. It includes:

Design Standards: Flexible, noise-reducing, unified.

Interaction Standards: Follows user behavior characteristics, product positioning, and mature user habits.

- [WYSIWYG with High Consistency in Construction and Rendering](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%A2%98%E5%9E%8B%E5%9C%BA%E6%99%AF%E5%8C%96%E8%AE%BE%E8%AE%A1)

In practical business usage, the system includes both questionnaire generation and deployment. We design question types in a scenario-based manner to ensure high consistency from production to application.

- [Materialized Question Type Design for Free Customization and Extension](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%A2%98%E5%9E%8B%E7%89%A9%E6%96%99%E5%8C%96%E8%AE%BE%E8%AE%A1/%E5%9F%BA%E7%A1%80%E8%AE%BE%E8%AE%A1)

The core component of questionnaires is question types, and their configurability determines the extensibility of business scenarios and the system's reusability. Each question type has general capabilities and atomic characteristics, ensuring high customization.

- [Compliance Accumulation and High Expandability in Security Capabilities](https://xiaojusurvey.didi.cn/docs/next/document/%E5%AE%89%E5%85%A8%E8%AE%BE%E8%AE%A1/%E6%A6%82%E8%BF%B0)

Data encryption, sensitive information detection, and anti-vote brushing capabilities ensure the security of the questionnaire publishing and data collection process.
Lightweight Design for Quick Integration and Flexible Expansion.

**2. Product-Level Open-Source Solution for Rapid Survey Process Implementation**

- [Product-Level Open-Source Solution for Rapid Survey Process Implementation](https://xiaojusurvey.didi.cn/docs/next/document/%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8C/%E6%A6%82%E8%BF%B0)

Provides complete product capabilities around the questionnaire lifecycle, including user management (login, registration, questionnaire permissions) and questionnaire management (create, edit, distribute, collect, data analysis), allowing for quick construction of survey solutions in specific fields.

- [Out-of-the-Box Questionnaire Design to Reduce Domain Complexity](https://xiaojusurvey.didi.cn/docs/next/document/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E7%90%86/%E9%97%AE%E5%8D%B7%E6%90%AD%E5%BB%BA%E9%A2%86%E5%9F%9F%E5%8C%96%E8%AE%BE%E8%AE%A1)

High flexibility in questionnaire composition leads to high complexity in editing capabilities. We divide questionnaire editing into five sub-domains for product capability clustering and guide system modular design and development. Based on module arrangement and management, it can be used out-of-the-box.

- [Low Cost for Secondary Development and Easy Customization](https://xiaojusurvey.didi.cn/docs/next/document/%E5%BC%80%E5%8F%91%E6%89%8B%E5%86%8C/%E5%B7%A5%E7%A8%8B%E9%85%8D%E7%BD%AE%E5%8C%96)

The entire system is designed based on protocol standardization, function modularization, and management configuration, and provides a complete set of documentation and development and extension manuals.

- [Low Deployment Cost for Quick Online Launch](https://xiaojusurvey.didi.cn/docs/next/document/%E5%B7%A5%E7%A8%8B%E9%83%A8%E7%BD%B2/Docker%E9%83%A8%E7%BD%B2)

The front-end and back-end separation, Dockerization solutions, and complete deployment guidance manual.

# Quick Start

Node Version >= 18.x, [ check environment preparation guide.](https://xiaojusurvey.didi.cn/docs/next/document/%E6%A6%82%E8%BF%B0/%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)

Clone Project

```shell
git clone git@github.com:didi/xiaoju-survey.git
```

## Server Startup

### Option 1: Quick Start without Database Installation

> _This is convenient for quickly previewing the project. For formal projects, use Option 2._

#### 1.Install Dependencies

```shell
cd server
npm install
```

#### 2.Start

```shell
npm run local
```

> The service relies on mongodb-memory-server:
> 1.Data is stored in memory and will be updated upon service restart.
> 2.When starting a new instance of the memory server, it will automatically download MongoDB binaries if not found, which might take some time initially.

### Option 2: (Recommended for Production)

#### 1.Configure Database

> The project uses MongoDB: [MongoDB Guide](https://xiaojusurvey.didi.cn/docs/next/document/%E6%A6%82%E8%BF%B0/%E6%95%B0%E6%8D%AE%E5%BA%93#%E5%AE%89%E8%A3%85)

Configure the database, check MongoDB configuration.

#### 2.Install Dependencies

```shell
cd server
npm install
```

#### 2.Install Dependencies

```shell
npm run dev
```

## Frontend Startup

### Install Dependencies

```shell
cd web
npm install
```

### Start

```shell
npm run serve
```

## Access

### Questionnaire Management End

[http://localhost:8080/management](http://localhost:8080)

### Questionnaire Deployment End

Create and publish a questionnaire.

[http://localhost:8080/render/:surveyPath](http://localhost:8080/render/:surveyPath)

<br /><br />

## WeChat Group

The official group will release the latest project news, construction plans, and community activities. Any questions and cooperation can contact the assistant:

<img src="https://img-hxy021.didistatic.com/static/starimg/img/KXKvc7sjHz1700061188156.png"  width="200" />

## QQ Group

The official group will release the latest project news, construction plans, and community activities. Welcome to join:

[<img src="https://img-hxy021.didistatic.com/static/starimg/img/iJUmLIHKV21700192846057.png"  width="210" />](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=P61UJI_q8AzizyBLGOm-bUvzNrUnSQq-&authKey=yZFtL9biGB5yiIME3%2Bi%2Bf6XMOdTNiuf0pCIaviEEAIryySNzVy6LJ4xl7uHdEcrM&noverify=0&group_code=920623419)

## Star

Open source is not easy. If this project helps you, please star it ❤️❤️❤️. Your support is our greatest motivation.

## Feedback

If you use this project, please leave feedback:[I'm using](https://github.com/didi/xiaoju-survey/issues/64), Your support is our greatest.

## Contribution

If you want to become a contributor or expand your technical stack, please check: [Contributor Guide](https://xiaojusurvey.didi.cn/docs/next/share/%E5%A6%82%E4%BD%95%E5%8F%82%E4%B8%8E%E8%B4%A1%E7%8C%AE). Your participation is our greatest honor.

## Feature

Pay attention to weekly construction updates: [Official Feature](https://github.com/didi/xiaoju-survey/issues/45)

## CHANGELOG

Follow major changes: [MAJOR CHANGELOG](https://github.com/didi/xiaoju-survey/issues/48)

## Article Sharing

1、[x.com](https://x.com/t_sudoooooo)

[Welcome to contribute.](https://xiaojusurvey.didi.cn/docs/next/article/%E7%AE%80%E4%BB%8B)
