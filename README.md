# OCS DeepSeek Adapter

通过 DeepSeek API 为 OCS 的自定义题库接口提供文字题答案。包含可导入的 JSON 配置、可维护的源码及中文教程。

**这是独立的非官方适配配置。OCS 网课助手由 [ocsjs/ocsjs](https://github.com/ocsjs/ocsjs) 维护，需从官方入口另行安装。**

## 下载与使用

- [下载配置 JSON](https://github.com/2488054910/ocs-deepseek-adapter/releases/latest/download/ocs-deepseek.json)
- [阅读完整教程](docs/guide.md)
- [发布版本与下载文件](https://github.com/2488054910/ocs-deepseek-adapter/releases)

1. 安装 [Tampermonkey（Edge 官方入口）](https://www.tampermonkey.net/index.php?browser=edge)。
2. 按 [OCS 官方安装教程](https://docs.ocsjs.com/docs/script)安装 OCS。脚本直链：[ocs.user.js](https://cdn.ocsjs.com/ocs.user.js)。
3. 下载本仓库的 `ocs-deepseek.json`，将占位符替换为自己的 DeepSeek API Key，保留 `Bearer ` 前缀及其后的一个英文空格。
4. 在 OCS 脚本元信息区加入 `// @connect api.deepseek.com`，保存后刷新课程页。
5. 在 OCS“通用 → 全局设置 → 题库配置”导入完整 JSON 数组并保存。
6. 先用“在线搜题”输入一条简单题验证连接，再核对练习题的匹配结果。首次测试可设为“不保存也不提交”。

无需为日常使用安装 Node.js 或启动本地服务器。

## 工作方式与限制

`题干、题型、选项 → DeepSeek API → answers 数组 → OCS 匹配与回填`

支持文字单选、多选、判断和按顺序排列的填空答案。请求要求模型返回 JSON，解析器会拒绝无效 JSON、空答案、非文字答案和未完整结束的响应。答案格式正确仍可能答错，模型解释混入答案也可能误匹配；请人工核验。

本配置只发送文字，没有接入 OCR、图片、公式图片或缺失材料。它不提供题库，不保证正确率，不绕过验证码或平台访问控制。使用时遵守课程、学校、平台及 API 服务的规则。

本项目以 OCS 5.2.1、Windows / Edge 验证接入；当前配置模型为 `deepseek-flash`，非流式、关闭思考模式。模型及 API 参数可能变化，参见 [DeepSeek 官方文档](https://api-docs.deepseek.com/)。没有足够可分离来源的公开样本，暂不发布 DeepSeek 独立正确率。

## 密钥与数据

仓库配置只包含 `REPLACE_WITH_YOUR_DEEPSEEK_API_KEY`。请求直接发送到 `api.deepseek.com`，使用你自己的 API 额度；题干和选项会传给 DeepSeek。适配器不主动读取或发送平台 Cookie、账号口令或其他页面存储。

填入真实 Key 后只保存在本机或油猴设置中。可将本机备份命名为 `ocs-deepseek.local.json`（已忽略），不要提交密钥、浏览器导出文件、课程原题或成绩截图。若密钥已泄露，应在 DeepSeek 控制台撤销并重新生成。

## 源码与验证

需要修改适配逻辑时，安装 Node.js 20 或以上版本，在仓库中执行：

```sh
npm run build
npm test
npm run check
```

无第三方 npm 依赖。构建只生成带占位符的公开配置；不会读取环境变量中的 Key。测试使用自行编写的假数据，不调用付费 API，也不下载或执行 OCS 主体代码。维护者应在发布前另行验证实际 OCS 兼容性。

## 版权与来源

本仓库自写代码与文档采用 [MIT License](LICENSE)。OCS、Tampermonkey、DeepSeek 和其他产品的权利与许可各自独立，详见 [来源与第三方声明](THIRD_PARTY_NOTICES.md)。本仓库不分发这些产品的主体代码、安装包、logo 或课程内容。
