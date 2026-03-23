# AI-Native Interview Check

候选人视角的 AI-Native 面试自查工具。单文件 HTML，零依赖，浏览器直接打开即用。  
**[在线访问 →](https://toolAssistant.github.io/ai-native-interview-check/)**  
**[GitHub 仓库 →](https://github.com/toolAssistant/ai-native-interview-check)**

---

这是一个给候选人自己使用的 AI-Native 面试训练页。

它源自一份“AI-Native 工程师招聘面试官手册”，但现在的产品目标已经变了：  
不是帮面试官打分，而是帮候选人自查自己的表达方式、判断方式和 AI 协作方式。

## 项目定位

它不是面试官打分表，也不是标准答案合集，而是一套给候选人自己使用的训练流程：

- 先独立作答，暴露真实表达和判断习惯
- 再展开 rubric，对照评分标准看差距
- 最后自己打分，并查看岗位倾向和能力短板

## 现在它能做什么

- **路线选择**：未确定 / Builder / Reviewer
- **逐题作答**：先写答案，再解锁评分标准
- **自评打分**：每道题自己给自己打 1 到 5 分
- **实时诊断**：边做边看当前总分、进度和岗位倾向
- **结果页总结**：输出模块拆分、短板、强项和高风险信号
- **本地进度保存**：刷新页面后可以继续

## 核心交互

1. 先选路线
2. 回答题目
3. 展开 rubric
4. 给自己打分
5. 查看累计结果和诊断建议

这个顺序是故意的。

如果一开始就先看“标准答案”，你看到的是 rubric；  
如果先回答再看标准，你暴露出来的才是自己真实的思考习惯。

## 适合谁

- 正在准备 AI-Native 工程师面试的人
- 想知道自己更偏 `Builder` 还是 `Reviewer` 的人
- 已经会用 AI 写代码，但不确定自己在面试里会输在哪的人

## 本地使用

```bash
# 直接打开
open index.html

# 或者用任意静态服务器
npx serve .
```

## GitHub Pages 部署

仓库已经带上 GitHub Pages 工作流：推送到 `main` 后，会自动把根目录里的 `index.html` 打包到 `_site/` 并发布。

首次启用时还需要在仓库里做一次设置：

1. 打开仓库 `Settings`
2. 进入 `Pages`
3. 在 `Build and deployment` 里把 `Source` 设为 `GitHub Actions`

完成后，后续每次推送 `main` 都会自动更新线上页面。

## 文件说明

- `index.html`：完整应用，包含样式、题库和交互逻辑
- `candidate-self-check-design.md`：这次重构的设计稿
- `test/index.test.mjs`：零依赖结构测试
- `test/github-pages.test.mjs`：GitHub Pages 发布配置测试

## 关于

[易哈佛医疗](https://www.ehafo.com) 内部工具演化版本，开源供同行参考。

---

MIT License
