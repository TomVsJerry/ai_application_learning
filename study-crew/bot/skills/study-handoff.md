---
description: Use when a study question about cooperating agents must be split across researcher, drafter, and reviewer.
---

# 学习小队交接

1. 从问题里选择目录 id：
   - 子智能体、角色、分工 → `subagent`
   - 同级智能体、独立部署、互相调用 → `peer`
   - 交接、派工顺序 → `handoff`
   - 工具继承、共享工具 → `shared-tools`
2. 派给 `researcher`。请它对每个 id 调用一次 `lookup_topic`，并原样返回笔记。
3. 等研究员返回后，把 title、summary、points、pitfall 交给 `drafter`。
4. 等撰写员返回后，把同一份笔记和草稿一起交给 `reviewer`。
5. 审阅结论是退回时，把修改意见再交给 `drafter` 一次，然后用新草稿回答。不要第三次重写，也不要再次审阅。
