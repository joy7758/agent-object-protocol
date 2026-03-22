<!-- language-switch:start -->
[English](./README.md) | [中文](./README.zh-CN.md)
<!-- language-switch:end -->

<!-- markdownlint-disable MD013 -->

# 代理对象协议 (AOP)

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18876796.svg)](https://doi.org/10.5281/zenodo.18876796)

> **状态：** 活动规范仓库
> **最新版本：** v1.1.2（[发行说明](RELEASE_NOTES_v1.1.2.md)）
> **公共 API：** 冻结于 v1.0.0（[AEP-0009](aep/aep-0009-v1.0-freeze.md)、[V1_PUBLIC_API_CANDIDATE](V1_PUBLIC_API_CANDIDATE.md)）
> **一致性：** 2-8 级已发布；可选的 9 级集成由 [AEP-0011](aep/aep-0011-v1.2-in-toto-statement-compat.md) 跟踪
> **范围：** 仅互操作性工件（架构 + 固定装置 + CI 门；此仓库中没有参考运行时）
> **许可证：** Apache-2.0

![协议按工件](docs/paper-evidence/protocol-by-artifacts.svg)

**版本控制说明：** 仓库版本遵循 SemVer (`v1.x.y`)。
清单字段 `aop_version` 当前针对 v1 之前的有效负载
已发布模式中的代 (`0.x`)。处理仓库发布
标签和有效负载 `aop_version` 作为单独的版本轴。

代理对象协议 (AOP) 是一个开放标准，用于定义
用于AI 智能体生态系统的可移植可执行对象合约。

## 数字生物圈生态系统

该仓库是**数字生物圈架构**的一部分。

架构概述：
[数字生物圈架构](https://github.com/joy7758/digital-biosphere-architecture)

该仓库不是更广泛的生态系统的顶级叙事中心。它应该被理解为围绕结构化代理对象和互操作性工件的支持和相邻协议工作。对于分层架构概述，请从 [digital-biosphere-architecture](https://github.com/joy7758/digital-biosphere-architecture) 开始；对于特定于角色的入口点，请参阅 [角色对象协议](https://github.com/joy7758/persona-object-protocol)。

AOP 强调可重现的互操作性工件：

- JSON 模式作为机器可读的合约
- 正/负样例作为可执行示例
- CI 门作为可裁决的一致性检查

## 快速链接

- 公共API接口：`V1_PUBLIC_API_CANDIDATE.md`
- 一致性配置文件：`CONFORMANCE.md`
- 引文元数据：`CITATION.cff`
- 核心模式系列：
  - `schemas/aop-object.schema.json`
  - `schemas/aop-policy.schema.json`
  - `schemas/aop-policy-decision.schema.json`
  - `schemas/aop-evidence.schema.json`
  - `schemas/profiles/*.schema.json`
- 发布里程碑：
  - `RELEASE_NOTES_v1.0.0.md`
  - `RELEASE_NOTES_v1.1.0.md`
  - `RELEASE_NOTES_v1.1.1.md`
  - `RELEASE_NOTES_v1.1.2.md`

一致性向量快速检查：

```bash
node tools/verify_conformance_vectors.mjs
```

## 纸质证据

用于纸质证据链的工件基线：

- 代码基线：[`main@c9f94ee`](https://github.com/joy7758/agent-object-protocol/commit/c9f94ee)
- 证据资产基线：
[`main@41242b1`](https://github.com/joy7758/agent-object-protocol/commit/41242b1)
- CI 证据运行：
[`22717328360`](https://github.com/joy7758/agent-object-protocol/actions/runs/22717328360)
- 图S8：
[`docs/paper-evidence/ci/S8_adversarial-gate-summary-ci.png`](docs/paper-evidence/ci/S8_adversarial-gate-summary-ci.png)
- S8清理日志摘录：
[`docs/paper-evidence/ci/ci_run_22717328360_job_65870183177.clean.log`](docs/paper-evidence/ci/ci_run_22717328360_job_65870183177.clean.log)

---

## 动机

当前的代理堆栈具有传输和调用标准，但通常
缺乏一个稳定的、可移植的对象契约层来显示形状，
治理、政策决策和证据约束力。

AOP 通过定义可互操作的工件来填补这一空白
独立于任何特定运行时进行验证。

---

## 核心概念

AOP 对象清单包括：

- `aop_version`
- `id`
- `kind`
- `name`
- `description`
- `schema.inputs`
- `schema.outputs`

最小对象示例（与当前模式形状对齐）：

```json
{
  "aop_version": "0.9",
  "id": "urn:aop:tool:file-search:v1",
  "kind": "tool",
  "name": "file-search",
  "description": "Search files in a directory",
  "schema": {
    "inputs": {
      "type": "object",
      "properties": {
        "path": { "type": "string" },
        "query": { "type": "string" }
      },
      "required": ["path", "query"],
      "additionalProperties": false
    },
    "outputs": {
      "type": "object",
      "properties": {
        "results": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["results"],
      "additionalProperties": false
    }
  }
}
```

---

## 规范和非规范来源

对于 v1 公共 API 基线，规范来源为：

- `V1_PUBLIC_API_CANDIDATE.md`
- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`
- `schemas/aop-policy-decision.schema.json`
- `schemas/aop-evidence.schema.json`
- `schemas/profiles/*.schema.json` 包含在 v1 候选表面中
- `CONFORMANCE.md` 级别和门语义

非规范但经过 CI 验证的互操作性工件包括：

- `schemas/aop-registry-record.schema.json`
- `schemas/aop-resolve-response.schema.json`
- `examples/**` 和 `examples/invalid/**`

---

## 快速入门（验证）

编译所有顶级架构（草案 2020-12）：

```bash
for schema in schemas/*.schema.json; do
  ajv compile --spec=draft2020 -s "${schema}"
done
```

对于灯具级验证规则（包括语义门、配置文件
检查，以及积极/消极的期望），使用：

- `CONFORMANCE.md`
- `.github/workflows/ci.yml`

---

## 与 MCP 的关系

AOP 是对模型上下文协议 (MCP) 的补充：

- MCP 专注于工具传输和调用通道。
- AOP 重点关注对象契约和一致性工件。

MCP 和 AOP 旨在组合，而不是竞争。

---

## 与 FAIR 数字对象的关系

AOP 的灵感来自于公平数字对象原则：

- 持久标识符
- 机器可读的元数据
- 互操作性优先语义

AOP 将这些思想应用到可执行的代理对象契约中。

---

## 里程碑和历史

- v0.5 基线版本：
  - `RELEASE_NOTES_v0.5.0.md`
- v1.0 公共 API 冻结：
  - `RELEASE_NOTES_v1.0.0.md`
  - `aep/aep-0009-v1.0-freeze.md`
- v1.1 DSSE 可选配置文件：
  - `RELEASE_NOTES_v1.1.0.md`
  - `aep/aep-0010-v1.1-dsse-optional-profile.md`
- v1.2 全面 DSSE 兼容性（正在进行中）：
  - `aep/aep-0011-v1.2-in-toto-statement-compat.md`

---

## 地位

AOP 作为规范仓库得到积极维护。

欢迎通过 AEP 提案、架构更新、
固定装置和一致性门改进。

## 引文

首选学术引文：

张，B.（2026）。代理对象协议：按工件的协议
机器可判定的人工智能制品。泽诺多.
[https://doi.org/10.5281/zenodo.18876796](https://doi.org/10.5281/zenodo.18876796)

`CITATION.cff` 中提供了仓库引用元数据。目前的
工程发布标签为`v1.1.2`；上面的 Zenodo DOI 仍然是
规范的学术引文。

参考书目：

```bibtex
@misc{agent_object_protocol_2026,
  title = {Agent Object Protocol: Protocol-by-Artifacts for Machine-Adjudicable AI Artifacts},
  author = {Zhang, Bin},
  year = {2026},
  publisher = {Zenodo},
  doi = {10.5281/zenodo.18876796},
  url = {https://doi.org/10.5281/zenodo.18876796}
}
```
