import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  name: "学习小队",
  description: "把一个学习问题交给研究员、撰写员和审阅员，再合成一份中文课。",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
});
