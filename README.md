# AI-Native Interview Check

这是根据另一个开源项目 [vorojar/ai-native-hiring-guide](https://github.com/vorojar/ai-native-hiring-guide) **《AI-Native 工程师招聘面试官手册》**， 翻转视角，改成了 候选人 自己使用的 AI-Native 面试自查页。

**[在线体验 →](https://toolAssistant.github.io/ai-native-interview-check/)**  单文件 HTML，零依赖，浏览器直接打开即用。

<img width="978" height="718" alt="image" src="https://github.com/user-attachments/assets/c7920cf1-8bf7-4014-8116-de457059c20f" />

---

### 使用说明

《AI-Native 工程师招聘面试官手册》把 AI-Native 工程师 分为： `Builder` 和 `Reviewer` 和 双栖

<img width="863" height="475" alt="image" src="https://github.com/user-attachments/assets/f97872ff-9a0c-4ad2-923a-194ae83e622a" />

你先像候选人一样作答，再像面试官一样对照 rubric，最后看看自己更偏 `Builder` 还是 `Reviewer`，短板到底暴露在哪。  


---

## 它和原版有什么不同

- 原版更像面试官的工作台：提问、观察、打分、做录用判断
- 当前版更像候选人的训练场：逐题作答、自评、复盘、发现短板

它不是面试官打分表，也不是标准答案合集，而是一套把面试流程翻过来给候选人自己使用的练习工具：
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

## 文件说明

- `index.html`：完整应用，包含样式、题库和交互逻辑
- `candidate-self-check-design.md`：这次重构的设计稿
- `test/index.test.mjs`：零依赖结构测试
- `test/github-pages.test.mjs`：GitHub Pages 发布配置测试

---

MIT License
