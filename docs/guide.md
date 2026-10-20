# 使用教程

适用：Windows / Edge、OCS 5.2.1。已安装的组件可跳过。

1. 安装[油猴](https://www.tampermonkey.net/index.php?browser=edge)。在 `edge://extensions` 启用扩展，按提示允许用户脚本或开启开发者模式。
2. 安装 [OCS](https://cdn.ocsjs.com/ocs.user.js)。打开油猴“管理面板 → OCS 网课助手 → 编辑”：

   1. 按 `Ctrl+Home` 回到文件顶部，找到**脚本最前面的元信息区**，范围在第一组 **`// ==UserScript==`** 与其下方第一个 **`// ==/UserScript==`** 之间。
   2. 在这个元信息区找到其他 **`@connect`** 行，**和它们放在一起**，添加这一行：

      ```javascript
      // @connect      api.deepseek.com
      ```

   按 `Ctrl+S` 保存。

3. 在 [DeepSeek 平台](https://platform.deepseek.com/)创建 API Key，确认 API 账户有余额。
4. 打开学习通章节页 → OCS“通用 → 全局设置 → 题库配置”，粘贴[配置](../ocs-deepseek.json)全文。只将 `REPLACE_WITH_YOUR_DEEPSEEK_API_KEY` 换成自己的 Key，保留 `Bearer `（含空格），保存并刷新。
5. 先设“不保存也不提交”，关闭划词搜索。在“在线搜题”输入 `2+3 等于多少？`，点空白处再搜索；返回 `5` 即连通。核对实际题目后，再调整保存或提交方式。

连接失败：先查 `Bearer `、`@connect` 和 API 余额。更新 OCS 后检查 `@connect` 是否保留。含真实 Key 的配置仅存本机。
