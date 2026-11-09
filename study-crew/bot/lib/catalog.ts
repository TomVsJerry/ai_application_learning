export type TopicNote = {
  id: string;
  title: string;
  summary: string;
  points: string[];
  pitfall: string;
};

const topics = {
  subagent: {
    id: "subagent",
    title: "子智能体",
    summary:
      "子智能体是同一个智能体里的专职角色。父智能体在一轮对话中把任务派给它，它没有自己的会话和工具目录。",
    points: [
      "目录是 bot/subagents/<id>/，其中 agent.ts 必须写出 description。父智能体靠这段描述决定要不要派工。",
      "可以加 instructions.md。省略 model 时，子智能体沿用父智能体的模型。",
      "父智能体通过内置的 task 工具派工。如果父智能体用 tools 限制了内置工具，列表里必须包含 task。",
      "子智能体继承父项目的工具、技能和连接。它自己的 tools、skills、channels、hooks 和嵌套 subagents 会被忽略。",
    ],
    pitfall:
      "不要把需要独立工具或独立会话的专家做成子智能体。那种专家应是同级智能体。",
  },
  peer: {
    id: "peer",
    title: "同级智能体",
    summary:
      "同级智能体是另一个完整项目。它有自己的指令、工具和会话，也可以单独打开 playground。",
    points: [
      "在调用方的 bot/mcp-connections/<name>.ts 里用 defineConnection({ agent }) 声明对方。文件名成为连接名。",
      "agent 在本地是对方的目录名，在托管部署上是部署 slug。两边部署在同一个团队后，平台负责路由和鉴权。",
      "第一次 ask 返回 status、sessionId 和 reply。下次把同一个 sessionId 传回去，才能接着上次的工作。",
      "对方仍在工作时 ask 会返回 running，再用 check 等待。call_tool 可以不开启对方的模型回合，直接调用它的服务器工具。",
    ],
    pitfall:
      "两个同级智能体不要互相把请求传回去。调用方写一条单向规则：何时询问对方，然后返回对方的答案。",
  },
  handoff: {
    id: "handoff",
    title: "交接顺序",
    summary:
      "协调者规定派工顺序，并在指令里写明何时派给谁。这个学习小队一次只派一个角色，等它返回再派下一个。",
    points: [
      "researcher 只返回目录笔记，drafter 只根据笔记写课，reviewer 只对照笔记检查草稿。",
      "审阅退回时，drafter 只再写一次。不要让三个角色循环改到没有停点。",
      "父指令要写出角色名，例如：需要目录事实时派给 researcher。",
      "轨迹里会留下 subagent.called 和 subagent.completed。失败或取消时 completed 的 isError 为 true。",
    ],
    pitfall: "不要在父指令里省略顺序。模型看到三个专家后，可能并行派工或跳过审阅。",
  },
  "shared-tools": {
    id: "shared-tools",
    title: "共享工具",
    summary:
      "子智能体使用父项目的工具。同级智能体使用自己项目里的工具。",
    points: [
      "查找目录用父项目的 lookup_topic。研究员、撰写员和审阅员都能调用它，因为他们继承父项目的执行面。",
      "在子智能体目录里再放一份 tools/ 不会生效，发现阶段会警告并忽略。",
      "需要单独工具集时，把专家做成同级智能体，而不是子目录。",
      "父智能体限制内置工具时，漏掉 task 就无法派工；漏掉 shell 时，execution 为 agent 的工具也无法运行。",
    ],
    pitfall:
      "不要为了让子智能体“拥有自己的工具”去复制一份 tools。复制的文件不会被加载。",
  },
} satisfies Record<string, TopicNote>;

export const topicIds = Object.keys(topics);

export function lookupTopic(id: string): TopicNote | undefined {
  if (!Object.prototype.hasOwnProperty.call(topics, id)) return undefined;
  return topics[id as keyof typeof topics];
}
