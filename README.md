# OCS DeepSeek Adapter

把 DeepSeek API 接入 OCS 的自定义题库，让 OCS 可以为文字题获取 AI 答案。项目提供可直接导入的 JSON 配置、可维护的适配源码和中文使用教程。

**[开始使用：简明教程](docs/guide.md)**

本项目是独立的非官方适配配置，基于 OCS 公开的 AnswererWrapper 接口。[OCS 网课助手](https://github.com/ocsjs/ocsjs)由 enncy 及其贡献者维护；Tampermonkey 提供脚本运行环境，DeepSeek 提供模型服务。

## 项目解决什么问题

OCS 可以读取课程页面中的题目并调用题库。本项目将 DeepSeek 转换为一个符合 OCS 接口要求的答案来源：把题型、题干和选项整理成模型请求，再把模型响应转换为 OCS 可处理的答案。

使用者提供自己的 DeepSeek API Key，按 API 实际调用付费。日常使用只需要浏览器、Tampermonkey、OCS 和本项目配置，无需安装 Node.js、Python 或运行本地服务器。

## 工作原理

```text
课程页面 → OCS 读取题型、题干和选项
         → 本配置构造 DeepSeek 请求
         → 模型返回结构化答案
         → 本配置解析响应
         → OCS 匹配选项或填写文本
```

提示词要求模型只返回一个包含 `answers` 数组的 JSON 对象，例如：

```json
{"answers":["选项甲","选项乙"]}
```

解析器读取 `choices[0].message.content`，校验 JSON 和答案元素，再将答案数组序列化为 OCS 支持的字符串。这样可以保留重复答案，以及选项中的 `C#`、分号等字符。选项匹配、保存和提交由 OCS 及其设置控制。

## 支持的题型

| 题型 | 模型输出 | OCS 后续处理 |
| --- | --- | --- |
| 文字单选 | 一个正确选项的完整文字 | 匹配对应选项 |
| 文字多选 | 多个正确选项的完整文字，保持选项顺序 | 分别匹配选项 |
| 判断 | “正确”或“错误” | 匹配判断选项 |
| 填空 | 按空位顺序排列的答案，保留重复值 | 按顺序填写 |

## 响应保护与能力限制

解析器会拦截 API 错误、缺少必要响应字段、未完整结束的回答、无效 JSON、非文字或空白答案。模型返回空答案数组时，不提供回填结果。

这些检查只能判断响应是否符合格式，不能证明答案正确。OCS 的文字匹配也可能受到选项变化、标点、解释性文字等影响。格式正确、搜到答案、匹配成功和平台判对是不同结果，重要答案仍需人工核验。

当前配置只发送文字，未接入图片、OCR、公式图片或题目缺失的材料。项目不提供现成题库，也不提供绕过验证码或平台访问控制的功能。使用时应遵守课程、学校、平台及 API 服务的规则。

## 兼容性与验证

接入已在 Windows / Microsoft Edge、OCS 5.2.1 中验证。默认模型为 `deepseek-flash`，使用非流式 JSON 输出并关闭思考模式。后续 OCS 或 DeepSeek 接口更新，可能需要重新适配。

仓库包含 24 项离线测试，覆盖题干传递、各类答案格式、重复值、特殊字符、异常响应、序列化执行和构建一致性。测试使用假数据，不调用付费 API。

目前没有能够逐题区分模型原始答案、其他题库来源和人工修改的公开样本，因此暂不公布 DeepSeek 独立正确率。离线测试通过和接口连通均不代表实际作答正确率。

## 数据与费用

题型、题干和选项直接发送至 `api.deepseek.com`，费用计入使用者自己的 DeepSeek API 账户。本项目没有中转服务器；适配器不主动读取或发送平台 Cookie、账号口令或其他页面存储。

公开配置中的密钥始终为 `REPLACE_WITH_YOUR_DEEPSEEK_API_KEY`。填写真实 Key 后，配置应仅保存在本机或油猴设置中。本机备份可命名为 `ocs-deepseek.local.json`，该命名已加入 Git 忽略规则。

## 仓库内容与开发

| 文件 | 内容 |
| --- | --- |
| `ocs-deepseek.json` | 可导入 OCS 的占位符配置 |
| `src/adapter.mjs` | 请求构造、响应解析和配置生成逻辑 |
| `docs/guide.md` | 简明安装与配置步骤 |
| `test/adapter.test.mjs` | 离线测试 |
| `THIRD_PARTY_NOTICES.md` | 上游来源和第三方权利说明 |

开发环境为 Node.js 20 或以上，无第三方 npm 依赖：

```sh
npm run build
npm test
npm run check
```

构建生成带占位符的公开配置，不读取环境变量中的真实 Key。发布文件可从 [Releases](https://github.com/2488054910/ocs-deepseek-adapter/releases) 获取。

## 版权与来源

本仓库自写代码与文档采用 [MIT License](LICENSE)。OCS、Tampermonkey、DeepSeek 等产品的版权、商标和许可由各自权利人持有，具体来源与核验版本见 [第三方声明](THIRD_PARTY_NOTICES.md)。

仓库仅发布独立适配配置及自写内容，不包含 OCS 主体、扩展安装包、品牌图片、课程视频、题目库或账号成绩。本项目未获相关项目的官方背书。
