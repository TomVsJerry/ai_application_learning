# AI 应用学习：多个智能体合作

这个仓库用一个可以运行的「学习小队」演示两种合作方式。

| | 子智能体 | 同级智能体 |
| --- | --- | --- |
| 是什么 | 同一个智能体里的角色 | 另一个完整智能体 |
| 放在哪 | `bot/subagents/<id>/` | 自己的项目目录 |
| 工具和会话 | 继承父项目，没有独立会话 | 拥有自己的工具和会话 |
| 谁能找到它 | 只有父智能体，通过 `task` 派工 | 本地一起启动，或同一团队里按部署名调用 |

本课先把三种角色做成子智能体。等某个角色需要自己的工具和 playground 时，再把它拆成同级智能体。

## 学习小队怎么分工

`study-crew` 是协调者。一个关于「智能体如何合作」的问题按这个顺序走：

1. `researcher` 调用 `lookup_topic`，只返回本地目录里的笔记。
2. `drafter` 把笔记写成中文课：结论、步骤、易错点。
3. `reviewer` 对照笔记检查草稿，给出通过或退回。
4. 退回时撰写员只改一次。协调者用最后一版课文回答。

目录是离线的，条目只有 `subagent`、`peer`、`handoff`、`shared-tools`。事实写在 `study-crew/bot/lib/catalog.ts`，模型不能临时编造。

## 打开这些文件

| 文件 | 你在学什么 |
| --- | --- |
| `study-crew/bot/agent.ts` | 协调者的名字和模型 |
| `study-crew/bot/instructions.md` | 何时派工。必须每次都遵守的规则放这里 |
| `study-crew/bot/skills/study-handoff.md` | 交接步骤。只在这类问题出现时加载 |
| `study-crew/bot/tools/lookup_topic.ts` | 一个只读服务器工具。文件名就是工具名 |
| `study-crew/bot/subagents/researcher/` | 子智能体：`agent.ts` 的 `description` 决定会不会被选中 |
| `study-crew/evals/smoke.eval.ts` | 固定一道题，检查有没有查目录、有没有派给三个角色 |

子智能体目录里不要再放 `tools/` 或 `skills/`。那些文件会被忽略。

## 在本机跑

需要 Node.js 22.13 或更新版本。不要用 Bun。

```bash
cd study-crew
npx @grok/agent-sdk validate --dir .
npx @grok/agent-sdk info --dir . --json
npx @grok/agent-sdk tool call lookup_topic --dir . --input '{"topic":"subagent"}' --json
npm run check
```

上面四条不需要登录。`lookup_topic` 会打印子智能体那一则笔记。

模型回合需要 Cursor 凭证。在你自己的终端登录一次：

```bash
npx @grok/agent-sdk login
npx @grok/agent-sdk dev --dir .
```

打开 playground 后问：

> 请说明子智能体和同级智能体的差别。先查目录 subagent 和 peer。

你应看到协调者依次派给研究员、撰写员和审阅员，回答里有结论、步骤、易错点。

同一道题也可以跑评测：

```bash
npx @grok/agent-sdk eval --dir .
```

## 自己改一处

在 `bot/subagents/quizzer/` 加一个出题角色：

1. `agent.ts` 用 `defineAgent` 写出 `description`，说明「课文通过之后，根据笔记出两道判断题」。
2. 写 `instructions.md`，要求题目只能来自笔记。
3. 在 `bot/instructions.md` 和 `study-handoff` 技能里，把出题放在审阅通过之后。
4. 在 `evals/smoke.eval.ts` 里加上 `t.calledSubagent("quizzer")`。

先跑 `validate` 和 `npm run check`。登录后再跑 `eval`。

## 部署

当前项目只在本地学习，还没有部署。要部署时，在你自己的终端执行，这样首次部署打印的令牌不会进入聊天记录：

```bash
npx @grok/agent-sdk validate --dir ./study-crew
npx @grok/agent-sdk deploy --dir ./study-crew --dry-run
npx @grok/agent-sdk deploy --dir ./study-crew
```

部署之后可以在 [Deployed Agents](https://cursor.com/dashboard/deployed-agents) 管理它。
