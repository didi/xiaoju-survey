const { useState } = React;

// ─── Mock Data ───────────────────────────────────────────────
const DATA = {
  project: "小桔问卷 (XiaojuSurvey)",
  lastSync: "2026-03-31 09:42",

  tasks: [
    {
      id: "task-image-ranking",
      name: "图片排序题型",
      pipelineStage: 4,
      progress: 65,
      status: "verify-retry",
      lastUpdated: "30分钟前",
      assignedRole: "frontend-coder",
      risks: ["scoreMode 字段格式待确认"],
      decisions: ["复用 DragSortable 组件"],
      spec: { product: true, interface: true, behavior: true, invariants: true },
      steps: [
        { name: "编辑态组件", done: true },
        { name: "预览态组件", done: true },
        { name: "运行态组件", done: true },
        { name: "setter 配置", done: true },
        { name: "导出映射", done: true },
        { name: "自验证通过", done: false, current: true },
      ],
      verification: {
        status: "retrying",
        attempt: 2,
        maxAttempts: 3,
        checks: [
          { name: "lint + typecheck", status: "pass" },
          { name: "单元测试", status: "pass" },
          { name: "构建检查", status: "pass" },
          { name: "题型三态一致", status: "pass" },
          { name: "setter 协议完整", status: "pass" },
          { name: "导出映射同步", status: "fail", note: "新题型 scoreMode 未映射到导出" },
          { name: "e2e 作答验证", status: "pending" },
        ],
        retryLog: [
          { attempt: 1, failed: "导出映射同步", fix: "补充 imageRanking 导出映射", result: "修复后发现 scoreMode 字段格式不匹配" },
          { attempt: 2, failed: "导出映射同步", fix: "修正 scoreMode 为 array 类型", result: "运行中..." },
        ],
      },
    },
    {
      id: "task-nps-template",
      name: "NPS 问卷模板",
      pipelineStage: 1,
      progress: 25,
      status: "spec-review",
      lastUpdated: "2小时前",
      assignedRole: "architect",
      risks: [],
      decisions: [],
      spec: { product: true, interface: true, behavior: false, invariants: false },
      steps: [
        { name: "PRD 分析", done: true },
        { name: "技术方案", done: false, current: true },
        { name: "任务拆解", done: false },
        { name: "实现", done: false },
        { name: "自验证", done: false },
      ],
      verification: null,
    },
  ],

  invariants: [
    { name: "题型三态一致", status: "pass", script: "check-triad.sh" },
    { name: "setter 协议完整", status: "pass", script: "check-setter.sh" },
    { name: "导出映射同步", status: "warn", script: "check-export.sh", note: "新题型未覆盖" },
    { name: "发布权限校验", status: "pass", script: "check-publish.sh" },
    { name: "Schema 协议合规", status: "pass", script: "check-schema.sh" },
    { name: "接口签名兼容", status: "fail", script: "check-api.sh", note: "v2 缺 pageSize" },
    { name: "RSA 加密链路", status: "pass", script: "check-rsa.sh" },
    { name: "防刷规则完整", status: "pass", script: "check-antispam.sh" },
  ],

  quality: {
    current: 87,
    previous: 82,
    trend: [72, 75, 78, 80, 82, 85, 82, 87],
    breakdown: {
      invariantPass: 75,
      testCoverage: 83,
      lintClean: 95,
      specComplete: 90,
    },
  },

  knowledge: [
    { type: "invariant", content: "新增：图片题拖拽排序必须保持顺序幂等", date: "3/29", source: "task-image-ranking" },
    { type: "pitfall", content: "Vue3 SortableJS 在 iOS Safari 下 touch 事件丢失", date: "3/28", source: "task-image-ranking" },
    { type: "boundary", content: "更新：物料层不得直接依赖问卷 store", date: "3/27", source: "refactor" },
    { type: "pitfall", content: "MongoDB aggregation $lookup 大数据量超时", date: "3/25", source: "perf-fix" },
    { type: "invariant", content: "新增：题型配置变更必须同步更新预览渲染", date: "3/24", source: "task-star-rating" },
  ],

  harnessGrowth: {
    labels: ["10月", "11月", "12月", "1月", "2月", "3月"],
    invariants: [3, 5, 6, 8, 8, 8],
    pitfalls: [1, 3, 5, 7, 9, 11],
    checks: [2, 3, 4, 5, 5, 6],
    totalCycles: 14,
  },

  harnessHealth: {
    docsCount: 14,
    invariantsCount: 8,
    checksCount: 6,
    skillsCount: 4,
    lastHarnessSync: "3/29 18:30",
  },

  pipelineStages: ["PRD", "Spec", "Tasks", "Code", "Verify", "Review", "Sync"],
};

// ─── Delivery Flow Steps（完整版，含触发条件/产出/读写原因）───
const FLOW_STEPS = [
  {
    id: "prd", label: "PRD 输入", icon: "", color: "#8b5cf6",
    skill: null, humanGate: false,
    summary: "需求进入系统，结构化存档",
    trigger: "PM 提交需求文档或口头描述",
    actions: [
      "读取原始 PRD / 需求描述",
      "存入 work/requests/req-xxx.md",
      "用 REQUEST_TEMPLATE 结构化：目标、场景、验收标准、非功能约束",
      "标记不明确内容为 TODO: needs input",
    ],
    reads: [
      { path: "harness/docs/product/overview.md", why: "理解产品定位，判断需求是否合理" },
      { path: "harness/docs/product/key-flows.md", why: "判断需求影响哪些核心路径" },
    ],
    writes: [
      { path: "work/requests/req-xxx.md", what: "结构化需求文档" },
    ],
    output: "一份结构化的需求文档，PM 可以直接阅读和修正",
    failPath: null,
  },
  {
    id: "spec", label: "技术方案", icon: "", color: "#3b82f6",
    skill: "prd-to-spec", humanGate: true, humanRole: "Tech Lead / 架构师确认",
    summary: "PRD → 四段式 Spec（业务意图·接口契约·行为边界·Invariant影响）",
    trigger: "需求文档就绪，触发 prd-to-spec skill",
    actions: [
      "读取 work/requests/req-xxx.md",
      "结合 harness/ 知识生成四段式技术方案：",
      "  ① 业务意图 Product Spec：做什么、为什么、成功标准",
      "  ② 接口契约 Interface Spec：API 签名、字段、枚举、DTO",
      "  ③ 行为边界 Behavior Spec：支持/不支持的场景、异常处理",
      "  ④ 影响的 Invariant 清单：这次改动可能触碰哪些不变量",
      "生成 work/specs/spec-xxx.md",
      "同步创建 harness/plans/active/task-xxx.md（作战地图）",
    ],
    reads: [
      { path: "harness/docs/architecture/boundaries.md", why: "确认模块边界，不越界" },
      { path: "harness/docs/architecture/invariants.md", why: "识别哪些不变量可能被影响" },
      { path: "harness/docs/engineering/api-contracts.md", why: "接口设计遵循现有契约" },
      { path: "harness/docs/engineering/conventions.md", why: "代码约定" },
      { path: "harness/docs/engineering/pitfalls.md", why: "避免已知坑" },
    ],
    writes: [
      { path: "work/specs/spec-xxx.md", what: "四段式技术方案" },
      { path: "harness/plans/active/task-xxx.md", what: "任务作战地图（背景、决策、状态）" },
      { path: "harness/plans/active/README.md", what: "更新当前任务指针" },
    ],
    output: "Tech Lead 确认后，技术方案锁定，进入下一步",
    failPath: "Tech Lead 不认可 → 修改 spec → 重新提交确认",
  },
  {
    id: "tasks", label: "任务拆解", icon: "", color: "#06b6d4",
    skill: "spec-to-tasks", humanGate: false,
    summary: "技术方案 → 原子任务列表（含依赖和验收条件）",
    trigger: "技术方案通过确认，触发 spec-to-tasks skill",
    actions: [
      "读取 work/specs/spec-xxx.md",
      "按模块/层级拆解成原子任务：",
      "  每个任务有：步骤描述、依赖关系、验收条件",
      "  标注可并行 vs 必须串行的任务",
      "  标注每个任务涉及的 invariant",
      "生成 work/tasks/tasks-xxx.md",
      "更新 harness/plans/active/task-xxx.md 进度状态",
    ],
    reads: [
      { path: "work/specs/spec-xxx.md", why: "技术方案是拆解的唯一输入" },
      { path: "harness/docs/architecture/boundaries.md", why: "按模块边界拆解" },
    ],
    writes: [
      { path: "work/tasks/tasks-xxx.md", what: "原子任务列表（含依赖和验收条件）" },
      { path: "harness/plans/active/task-xxx.md", what: "更新进度：任务拆解完成" },
    ],
    output: "可直接执行的任务清单，每个任务独立可验证",
    failPath: null,
  },
  {
    id: "code", label: "代码实现", icon: "", color: "#10b981",
    skill: null, humanGate: false, isAgentLoop: true,
    summary: "按 coder 角色逐任务实现，跨 session 从 task-*.md 接力",
    trigger: "任务列表就绪，agent 按顺序/并行开始编码",
    actions: [
      "切换到 coder 角色（读 harness/roles/coder.md）",
      "逐个任务执行：",
      "  读取当前任务的验收条件",
      "  写代码（遵循 conventions、guidelines）",
      "  每完成一个任务，更新 task-xxx.md 进度勾选",
      "  如果是跨 session，从 task-xxx.md 接力继续",
      "长任务中间产物写入 work/runs/run-xxx.md",
    ],
    reads: [
      { path: "work/tasks/tasks-xxx.md", why: "知道下一步做什么" },
      { path: "harness/plans/active/task-xxx.md", why: "跨 session 接力" },
      { path: "harness/roles/coder.md", why: "角色约束" },
      { path: "harness/docs/engineering/frontend-guidelines.md", why: "前端实现规则" },
      { path: "harness/docs/engineering/backend-guidelines.md", why: "后端实现规则" },
      { path: "harness/docs/engineering/commands.md", why: "知道怎么跑/测/构建" },
    ],
    writes: [
      { path: "src/ (业务代码)", what: "实际代码变更" },
      { path: "work/runs/run-xxx.md", what: "执行日志 / progress" },
      { path: "harness/plans/active/task-xxx.md", what: "逐步更新进度" },
    ],
    output: "所有任务的代码实现完成",
    failPath: "编译/类型检查失败 → agent 自行修复 → 超过 3 次升级给人",
  },
  {
    id: "verify", label: "自验证", icon: "", color: "#f59e0b",
    skill: "implementation-self-check", humanGate: false, isRetry: true,
    summary: "跑全部检查 → 失败自动修复 → 通过才提 PR",
    trigger: "代码实现完成，触发 implementation-self-check skill",
    actions: [
      "按顺序执行检查链：",
      "  ① scripts/checks/lint-all.sh → lint + typecheck",
      "  ② 单元测试 → npm test / vitest",
      "  ③ 构建检查 → npm run build",
      "  ④ invariant 专项检查 → 对照 spec 里标记的 invariant 逐条跑",
      "  ⑤ 如有 e2e → playwright / cypress smoke",
      "汇总结果写入 work/evals/eval-xxx.md",
      "如果有失败项：",
      "  分析失败原因（check 输出会告诉 agent 错在哪）",
      "  自动修复 → 重新跑检查",
      "  最多重试 N 次，超过则标记为需人工介入",
    ],
    reads: [
      { path: "scripts/checks/README.md", why: "知道跑哪些检查、对应哪些 invariant" },
      { path: "harness/docs/architecture/invariants.md", why: "逐条对照验证" },
      { path: "harness/docs/quality/checklist.md", why: "提交前完整检查清单" },
      { path: "work/specs/spec-xxx.md", why: "验收标准回查" },
    ],
    writes: [
      { path: "work/evals/eval-xxx.md", what: "验证报告（通过/失败/修复记录）" },
      { path: "harness/plans/active/task-xxx.md", what: "更新进度：自验证完成" },
    ],
    output: "全部检查通过 → 可以提 PR",
    failPath: "失败 → 自动修复 → 重新跑 → 超限升级人工",
    retryLoop: {
      maxRetries: 3,
      onFail: "check 失败输出作为下一轮 agent context 的输入信号",
      onExhaust: "标记为 blocked，通知人工介入",
    },
  },
  {
    id: "review", label: "人工 Review", icon: "", color: "#ec4899",
    skill: null, humanGate: true, humanRole: "研发 Review diff + 架构师 Review 影响面",
    summary: "人只看 diff（spec 已锁定），发现新问题存入 evals",
    trigger: "自验证全部通过，提交 PR",
    actions: [
      "生成 PR 描述：",
      "  变更摘要（自动从 spec + tasks 提炼）",
      "  影响的 invariant 清单",
      "  自验证结果摘要",
      "  风险标注",
      "研发 review diff，不用从零理解需求（spec 已锁定）",
      "如发现新问题 → 输出候选 invariant 草稿存入 work/evals/",
    ],
    reads: [
      { path: "work/specs/spec-xxx.md", why: "PR 描述引用" },
      { path: "work/evals/eval-xxx.md", why: "自验证结果" },
    ],
    writes: [
      { path: "work/evals/review-findings-xxx.md", what: "人工 review 发现的新问题（可选）" },
    ],
    output: "PR 合并进主干",
    failPath: "Review 不通过 → 修改 → 重新自验证 → 重新 Review",
  },
  {
    id: "sync", label: "知识回灌", icon: "", color: "#22c55e",
    skill: "harness-sync", humanGate: true, humanRole: "确认知识草稿后写入",
    summary: "PR merge 后，回答 4 个问题，把新知识写回 harness/",
    trigger: "PR merge 后触发 harness-sync skill",
    actions: [
      "读取本次 PR diff + specs + evals + review findings",
      "回答 4 个问题：",
      "  ① 新 invariant？→ 草稿追加 invariants.md",
      "  ② 新坑？→ 草稿追加 pitfalls.md",
      "  ③ 边界变化？→ 草稿更新 boundaries.md",
      "  ④ 新 check script？→ 草稿补入 scripts/checks/",
      "如果 4 个问题都答不出 → 只更新 quality-score.md",
      "所有写入先输出草稿，等人确认后才写入",
      "将 plans/active/task-xxx.md 移到 plans/recent/",
      "清理 work/ 中的临时工件",
    ],
    reads: [
      { path: "PR diff", why: "识别变更范围" },
      { path: "work/specs/spec-xxx.md", why: "技术方案回顾" },
      { path: "work/evals/eval-xxx.md", why: "验证结果" },
      { path: "work/evals/review-findings-xxx.md", why: "人工 review 发现" },
    ],
    writes: [
      { path: "harness/docs/architecture/invariants.md", what: "新不变量（如有）" },
      { path: "harness/docs/engineering/pitfalls.md", what: "新坑（如有）" },
      { path: "harness/docs/architecture/boundaries.md", what: "边界更新（如有）" },
      { path: "scripts/checks/", what: "新检查脚本（如有）" },
      { path: "harness/docs/quality/quality-score.md", what: "质量分更新" },
      { path: "harness/plans/recent/task-xxx.md", what: "归档完成的计划" },
    ],
    output: "harness/ 更新完成，下次需求读到的知识更完整",
    failPath: null,
  },
];

// ─── Utility Components ──────────────────────────────────────

const StatusDot = ({ status, size = 8 }) => {
  const c = { pass: "#22c55e", fail: "#ef4444", warn: "#f59e0b", pending: "#475569", "verify-retry": "#f59e0b", "spec-review": "#a855f7", "in-progress": "#3b82f6", blocked: "#ef4444" }[status] || "#475569";
  return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", backgroundColor: c, boxShadow: `0 0 6px ${c}40`, flexShrink: 0 }} />;
};

const Tag = ({ children, color = "#475569", bg = null }) => (
  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 8, backgroundColor: bg || `${color}18`, color, whiteSpace: "nowrap", fontWeight: 500 }}>
    {children}
  </span>
);

const FileTag = ({ path, type, why }) => {
  const c = type === "read" ? { bg: "#1e3a5f", text: "#7dd3fc" } : { bg: "#1a3329", text: "#6ee7b7" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, marginBottom: 3 }}>
      <span style={{ display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: c.bg, color: c.text, fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>{path}</span>
      {why && <span style={{ fontSize: 10, color: "#475569", paddingLeft: 8 }}>{why}</span>}
    </div>
  );
};

const ProgressBar = ({ value, h = 4, color = "#3b82f6" }) => (
  <div style={{ width: "100%", height: h, borderRadius: h, backgroundColor: "#1e293b", overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: h, backgroundColor: color, transition: "width 0.6s ease" }} />
  </div>
);

const Card = ({ children, style = {}, onClick = undefined }) => (
  <div
    onClick={onClick}
    style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "14px 16px", cursor: onClick ? "pointer" : "default", transition: "border-color 0.2s", ...style }}
    onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = "#334155"; }}
    onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = "#1e293b"; }}
  >{children}</div>
);

const Section = ({ title, count = undefined, children, style = {} }) => (
  <div style={{ marginBottom: 18, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.05em", textTransform: "uppercase" }}>{title}</span>
      {count != null && <span style={{ fontSize: 10, color: "#475569", backgroundColor: "#1e293b", padding: "1px 6px", borderRadius: 10 }}>{count}</span>}
    </div>
    {children}
  </div>
);

const MiniSparkline = ({ data, color = "#3b82f6", width = 80, height = 24 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (() => {
        const lastY = height - ((data[data.length - 1] - min) / range) * (height - 4) - 2;
        return <circle cx={width} cy={lastY} r="2.5" fill={color} />;
      })()}
    </svg>
  );
};

const CircleScore = ({ value, size = 52, stroke = 4 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (value / 100) * circ;
  const c = value >= 85 ? "#22c55e" : value >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s" }} />
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{value}</div>
    </div>
  );
};

const MiniBar = ({ data, colors, labels, height = 80, barWidth = 24 }) => {
  const allVals = data.reduce((a, d) => [...a, ...d], []);
  const max = Math.max(...allVals);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height }}>
      {labels.map((l, li) => {
        const stack = colors.map((_, ci) => data[ci][li]);
        return (
          <div key={li} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <div style={{ display: "flex", flexDirection: "column-reverse", height: height - 16, justifyContent: "flex-start" }}>
              {stack.map((v, si) => (
                <div key={si} style={{ width: barWidth, height: `${(v / (max * 1.2)) * 100}%`, backgroundColor: colors[si], borderRadius: si === stack.length - 1 ? "3px 3px 0 0" : 0, minHeight: v > 0 ? 2 : 0 }} />
              ))}
            </div>
            <span style={{ fontSize: 9, color: "#475569" }}>{l}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Pipeline Visual ─────────────────────────────────────────
const STAGE_COLORS = ["#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#22c55e"];

const PipelineLane = ({ task, stages }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
    <span style={{ fontSize: 11, color: "#94a3b8", width: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flexShrink: 0 }}>{task.name}</span>
    {stages.map((s, i) => {
      const isCurrent = i === task.pipelineStage;
      const isPast = i < task.pipelineStage;
      const isRetry = isCurrent && task.verification?.status === "retrying";
      return (
        <div key={i} style={{
          flex: 1, height: 22, borderRadius: 3,
          backgroundColor: isCurrent ? STAGE_COLORS[i] : isPast ? `${STAGE_COLORS[i]}40` : "#0f172a",
          border: `1px solid ${isCurrent ? STAGE_COLORS[i] : isPast ? `${STAGE_COLORS[i]}30` : "#1e293b"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: isCurrent ? "#fff" : "transparent", fontWeight: 600,
          position: "relative", overflow: "hidden",
        }}>
          {isCurrent ? s : ""}
          {isRetry && <span style={{ position: "absolute", right: 2, top: 1, fontSize: 8, opacity: 0.8 }}>↻</span>}
        </div>
      );
    })}
  </div>
);

// ─── Spec Coverage ───────────────────────────────────────────
const SPEC_ITEMS = [
  { key: "product", label: "业务意图" },
  { key: "interface", label: "接口契约" },
  { key: "behavior", label: "行为边界" },
  { key: "invariants", label: "Invariant" },
];

const SpecCoverage = ({ spec, compact = false }) => {
  if (compact) {
    const done = SPEC_ITEMS.filter(i => spec[i.key]).length;
    return <span style={{ fontSize: 11, color: done === 4 ? "#22c55e" : "#f59e0b" }}>Spec {done}/4</span>;
  }
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {SPEC_ITEMS.map(i => (
        <div key={i.key} style={{
          fontSize: 10, padding: "3px 8px", borderRadius: 6,
          backgroundColor: spec[i.key] ? "#22c55e15" : "#ef444415",
          color: spec[i.key] ? "#22c55e" : "#ef4444",
          border: `1px solid ${spec[i.key] ? "#22c55e30" : "#ef444430"}`,
        }}>
          {spec[i.key] ? "✓" : "✗"} {i.label}
        </div>
      ))}
    </div>
  );
};

// ─── Verification Detail ─────────────────────────────────────
const VerificationPanel = ({ v }) => {
  if (!v) return <div style={{ fontSize: 12, color: "#475569" }}>尚未进入自验证阶段</div>;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Tag color={v.status === "retrying" ? "#f59e0b" : v.status === "passed" ? "#22c55e" : "#ef4444"}>
          {v.status === "retrying" ? `第 ${v.attempt}/${v.maxAttempts} 次重试` : v.status}
        </Tag>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 12 }}>
        {v.checks.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 6px", borderRadius: 5, backgroundColor: c.status === "fail" ? "#ef444408" : "transparent" }}>
            <StatusDot status={c.status} size={7} />
            <span style={{ fontSize: 12, color: c.status === "fail" ? "#fca5a5" : "#94a3b8", flex: 1 }}>{c.name}</span>
            {c.note && <span style={{ fontSize: 10, color: "#f59e0b" }}>{c.note}</span>}
          </div>
        ))}
      </div>
      {v.retryLog.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>修复记录</div>
          {v.retryLog.map((r, i) => (
            <div key={i} style={{ padding: "8px 10px", backgroundColor: "#0a0f1e", borderRadius: 6, marginBottom: 4, border: "1px solid #1e293b" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 600 }}>第 {r.attempt} 次</span>
                <span style={{ fontSize: 11, color: "#ef4444" }}>失败：{r.failed}</span>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>修复：{r.fix}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>结果：{r.result}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Flow Step Detail（完整版：触发条件 + 读写原因 + 产出 + 重试循环）───
const FlowStepDetail = ({ step }) => (
  <div style={{ padding: "14px 16px", backgroundColor: "#0a0f1e", borderRadius: "0 0 10px 10px", border: `1px solid ${step.color}25`, borderTop: "none", marginTop: -9, marginBottom: 6 }}>
    {/* 触发条件 */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>触发条件</div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>{step.trigger}</div>
    </div>

    {/* Agent 执行 */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Agent 执行</div>
      {step.actions.map((a, i) => (
        <div key={i} style={{
          fontSize: 12,
          color: a.startsWith("  ") ? "#64748b" : "#cbd5e1",
          paddingLeft: a.startsWith("  ") ? 16 : 0,
          lineHeight: 1.5,
          display: "flex", alignItems: "flex-start", gap: 6,
        }}>
          {!a.startsWith("  ") && <span style={{ color: step.color, fontSize: 8, marginTop: 5, flexShrink: 0 }}>●</span>}
          <span>{a.startsWith("  ") ? a.trim() : a}</span>
        </div>
      ))}
    </div>

    {/* 读取 */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        读取 <span style={{ color: "#7dd3fc" }}>▼</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {step.reads.map((r, i) => <FileTag key={i} path={r.path} type="read" why={r.why} />)}
      </div>
    </div>

    {/* 写入 */}
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        写入 <span style={{ color: "#6ee7b7" }}>▲</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {step.writes.map((w, i) => <FileTag key={i} path={w.path} type="write" why={w.what} />)}
      </div>
    </div>

    {/* 产出 */}
    <div style={{ marginBottom: step.failPath ? 12 : 0 }}>
      <div style={{ fontSize: 10, color: "#475569", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>产出</div>
      <div style={{ fontSize: 12, color: "#22c55e" }}>✓ {step.output}</div>
    </div>

    {/* 失败路径 */}
    {step.failPath && (
      <div style={{ padding: "8px 10px", backgroundColor: "#1c0a0a", borderRadius: 6, border: "1px solid #ef444425" }}>
        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 600, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>失败路径</div>
        <div style={{ fontSize: 11, color: "#fca5a5" }}>{step.failPath}</div>
        {step.retryLoop && (
          <div style={{ marginTop: 6, fontSize: 11, color: "#94a3b8" }}>
            <div>最大重试：{step.retryLoop.maxRetries} 次</div>
            <div>重试机制：{step.retryLoop.onFail}</div>
            <div>超限处理：{step.retryLoop.onExhaust}</div>
          </div>
        )}
      </div>
    )}
  </div>
);

// ─── Human Roles Summary ─────────────────────────────────────
const HUMAN_ROLES = [
  { when: "Spec 确认", who: "Tech Lead", does: "确认技术方案方向对不对（Human-in-the-loop）", note: "不用看代码，只看 spec" },
  { when: "PR Review", who: "研发", does: "Review diff，不是从零理解需求（Human-on-the-loop）", note: "spec 已锁定，只看变更" },
  { when: "知识回灌", who: "任何人", does: "确认 harness-sync 生成的知识草稿", note: "10 分钟以内" },
  { when: "失败升级", who: "研发", does: "agent 自修复超限时介入", note: "只在 agent 搞不定时" },
];

const HumanRolesSummary = () => (
  <Card style={{ marginBottom: 16, border: "1px solid #ec489920" }}>
    <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>人在哪里介入？</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {HUMAN_ROLES.map((h, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Tag color="#ec4899">{h.when}</Tag>
          <div>
            <div style={{ fontSize: 12, color: "#cbd5e1" }}>
              <span style={{ fontWeight: 600 }}>{h.who}</span>：{h.does}
            </div>
            <div style={{ fontSize: 10, color: "#475569" }}>{h.note}</div>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

// ─── Quality Breakdown Labels ────────────────────────────────
const QUALITY_LABELS = {
  invariantPass: "不变量通过率",
  testCoverage: "测试覆盖率",
  lintClean: "Lint 清洁度",
  specComplete: "Spec 完整度",
};

// ─── Main App ────────────────────────────────────────────────
function HarnessCommandCenter() {
  const [view, setView] = useState("overview");
  const [selectedTask, setSelectedTask] = useState(/** @type {string|null} */ (null));
  const [expandedStep, setExpandedStep] = useState(/** @type {string|null} */ (null));

  const d = DATA;
  const passCount = d.invariants.filter(i => i.status === "pass").length;
  const failCount = d.invariants.filter(i => i.status === "fail").length;

  const nav = (v, taskId) => { setView(v); setSelectedTask(taskId || null); setExpandedStep(null); };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "#e2e8f0", fontFamily: "'DM Sans', 'Noto Sans SC', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />
      <style>{`* { box-sizing:border-box; } ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-thumb { background:#1e293b; border-radius:4px; } @keyframes fadeIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }`}</style>

      <div style={{ margin: "0 auto", padding: "16px 14px", animation: "fadeIn 0.25s ease" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "#334155", letterSpacing: "0.1em", textTransform: "uppercase" }}>Harness Command Center</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9" }}>{d.project}</div>
          </div>
          <div style={{ fontSize: 11, color: "#475569", textAlign: "right" }}>
            <div>同步 {d.lastSync}</div>
            <div>飞轮已转 <span style={{ color: "#22c55e", fontWeight: 600 }}>{d.harnessGrowth.totalCycles}</span> 圈</div>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16, backgroundColor: "#0f172a", borderRadius: 8, padding: 3 }}>
          {[
            { id: "overview", label: "概览" },
            { id: "flow", label: "交付流程" },
          ].map(t => (
            <button key={t.id} onClick={() => nav(t.id)} style={{
              flex: 1, padding: "7px 0", borderRadius: 6, border: "none", cursor: "pointer",
              backgroundColor: view === t.id || (view === "task-detail" && t.id === "overview") ? "#1e293b" : "transparent",
              color: view === t.id || (view === "task-detail" && t.id === "overview") ? "#e2e8f0" : "#64748b",
              fontSize: 12, fontWeight: 600, transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ═══════════ OVERVIEW ═══════════ */}
        {view === "overview" && (
          <div>
            {/* Top metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
              <Card style={{ textAlign: "center", padding: "12px 6px" }}>
                <CircleScore value={d.quality.current} />
                <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>质量分</div>
                <div style={{ fontSize: 10, color: "#22c55e" }}>↑{d.quality.current - d.quality.previous}</div>
              </Card>
              <Card style={{ textAlign: "center", padding: "12px 6px" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{passCount}<span style={{ fontSize: 13, color: "#475569" }}>/{d.invariants.length}</span></div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>不变量通过</div>
                {failCount > 0 && <div style={{ fontSize: 10, color: "#ef4444" }}>{failCount} 失败</div>}
              </Card>
              <Card style={{ textAlign: "center", padding: "12px 6px" }}>
                <div style={{ fontSize: 22, fontWeight: 700 }}>{d.harnessGrowth.totalCycles}</div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>飞轮圈数</div>
                <MiniSparkline data={d.quality.trend} color="#22c55e" width={60} height={18} />
              </Card>
            </div>

            {/* Pipeline */}
            <Section title="交付流水线">
              <Card>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                  {d.pipelineStages.map((s, i) => (
                    <div key={i} style={{ flex: 1, textAlign: "center", fontSize: 9, color: "#475569", paddingBottom: 4, borderBottom: `1px solid ${STAGE_COLORS[i]}30` }}>{s}</div>
                  ))}
                </div>
                {d.tasks.map(t => <PipelineLane key={t.id} task={t} stages={d.pipelineStages} />)}
              </Card>
            </Section>

            {/* Active Tasks */}
            <Section title="当前任务" count={d.tasks.length}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.tasks.map(t => (
                  <Card key={t.id} onClick={() => nav("task-detail", t.id)} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <StatusDot status={t.status} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</span>
                        <Tag color="#94a3b8">{d.pipelineStages[t.pipelineStage]}</Tag>
                      </div>
                      <span style={{ fontSize: 11, color: "#475569" }}>{t.lastUpdated}</span>
                    </div>
                    <ProgressBar value={t.progress} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                      <SpecCoverage spec={t.spec} compact />
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {t.verification?.status === "retrying" && <Tag color="#f59e0b">重试 {t.verification.attempt}/{t.verification.maxAttempts}</Tag>}
                        {t.risks.length > 0 && <span style={{ fontSize: 11, color: "#f59e0b" }}>⚠ {t.risks.length}</span>}
                        <span style={{ fontSize: 11, color: "#475569" }}>{t.steps.filter(s => s.done).length}/{t.steps.length}步</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>

            {/* Invariants */}
            <Section title="不变量" count={d.invariants.length}>
              <Card style={{ padding: "10px 12px" }}>
                {d.invariants.map((inv, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 2px" }}>
                    <StatusDot status={inv.status} size={7} />
                    <span style={{ fontSize: 12, color: "#94a3b8", flex: 1 }}>{inv.name}</span>
                    <span style={{ fontSize: 10, color: "#334155", fontFamily: "'DM Mono', monospace" }}>{inv.script}</span>
                  </div>
                ))}
                {d.invariants.filter(i => i.note).map((inv, i) => (
                  <div key={`n${i}`} style={{ fontSize: 11, color: inv.status === "fail" ? "#fca5a5" : "#fbbf24", marginTop: 4 }}>
                    {inv.name}：{inv.note}
                  </div>
                ))}
              </Card>
            </Section>

            {/* Quality Breakdown */}
            <Section title="质量明细">
              <Card>
                {Object.entries(d.quality.breakdown).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{QUALITY_LABELS[k]}</span>
                      <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600 }}>{v}%</span>
                    </div>
                    <ProgressBar value={v} color={v >= 90 ? "#22c55e" : v >= 70 ? "#3b82f6" : "#f59e0b"} />
                  </div>
                ))}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, borderTop: "1px solid #1e293b", paddingTop: 10 }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>趋势</span>
                  <MiniSparkline data={d.quality.trend} color="#22c55e" width={120} height={22} />
                </div>
              </Card>
            </Section>

            {/* Harness Growth */}
            <Section title="Harness 积累趋势">
              <Card>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <MiniBar
                    data={[d.harnessGrowth.invariants, d.harnessGrowth.pitfalls, d.harnessGrowth.checks]}
                    colors={["#3b82f6", "#f59e0b", "#06b6d4"]}
                    labels={d.harnessGrowth.labels}
                    height={72}
                    barWidth={20}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginLeft: 16 }}>
                    {[
                      { color: "#3b82f6", label: "不变量", val: d.harnessGrowth.invariants.slice(-1)[0] },
                      { color: "#f59e0b", label: "已知坑", val: d.harnessGrowth.pitfalls.slice(-1)[0] },
                      { color: "#06b6d4", label: "检查脚本", val: d.harnessGrowth.checks.slice(-1)[0] },
                    ].map((m, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: m.color }} />
                        <span style={{ fontSize: 11, color: "#64748b" }}>{m.label}</span>
                        <span style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 600 }}>{m.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Section>

            {/* Knowledge Feed */}
            <Section title="知识沉淀" count={d.knowledge.length}>
              <Card style={{ padding: "10px 12px" }}>
                {d.knowledge.map((k, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", borderBottom: i < d.knowledge.length - 1 ? "1px solid #0f172a" : "none" }}>
                    <Tag color={{ invariant: "#3b82f6", pitfall: "#f59e0b", boundary: "#a855f7" }[k.type]}>
                      {{ invariant: "不变量", pitfall: "坑", boundary: "边界" }[k.type]}
                    </Tag>
                    <span style={{ fontSize: 12, color: "#94a3b8", flex: 1, lineHeight: 1.4 }}>{k.content}</span>
                    <span style={{ fontSize: 10, color: "#334155", flexShrink: 0 }}>{k.date}</span>
                  </div>
                ))}
              </Card>
            </Section>

            {/* Harness Health */}
            <Section title="Harness 健康度">
              <Card>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "文档", value: d.harnessHealth.docsCount },
                    { label: "不变量", value: d.harnessHealth.invariantsCount },
                    { label: "检查脚本", value: d.harnessHealth.checksCount },
                    { label: "Skills", value: d.harnessHealth.skillsCount },
                  ].map((m, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "#e2e8f0" }}>{m.value}</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 10, textAlign: "center" }}>
                  上次 harness-sync：{d.harnessHealth.lastHarnessSync}
                </div>
              </Card>
            </Section>
          </div>
        )}

        {/* ═══════════ TASK DETAIL ═══════════ */}
        {view === "task-detail" && (() => {
          const t = d.tasks.find(x => x.id === selectedTask);
          if (!t) return null;
          return (
            <div>
              <button onClick={() => nav("overview")} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 12, padding: "4px 0", marginBottom: 10 }}>← 返回概览</button>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <StatusDot status={t.status} />
                <span style={{ fontSize: 16, fontWeight: 700 }}>{t.name}</span>
                <Tag color="#94a3b8">{d.pipelineStages[t.pipelineStage]}</Tag>
                <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>{t.lastUpdated}</span>
              </div>

              <Section title="Spec 覆盖度">
                <Card><SpecCoverage spec={t.spec} /></Card>
              </Section>

              <Section title="执行进度">
                <Card>
                  {t.steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                      <span style={{ fontSize: 13, width: 18, textAlign: "center", color: s.done ? "#22c55e" : s.current ? "#e2e8f0" : "#334155" }}>
                        {s.done ? "✓" : s.current ? "▶" : "○"}
                      </span>
                      <span style={{ fontSize: 13, color: s.done ? "#22c55e" : s.current ? "#e2e8f0" : "#475569", fontWeight: s.current ? 600 : 400 }}>{s.name}</span>
                    </div>
                  ))}
                </Card>
              </Section>

              <Section title="自验证状态">
                <Card><VerificationPanel v={t.verification} /></Card>
              </Section>

              {(t.risks.length > 0 || t.decisions.length > 0) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {t.risks.length > 0 && (
                    <Card style={{ borderColor: "#f59e0b20" }}>
                      <div style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600, marginBottom: 4 }}>风险</div>
                      {t.risks.map((r, i) => <div key={i} style={{ fontSize: 12, color: "#fbbf24" }}>{r}</div>)}
                    </Card>
                  )}
                  {t.decisions.length > 0 && (
                    <Card>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>决策</div>
                      {t.decisions.map((dd, i) => <div key={i} style={{ fontSize: 12, color: "#cbd5e1" }}>{dd}</div>)}
                    </Card>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ═══════════ FLOW ═══════════ */}
        {view === "flow" && (
          <div>
            {/* 人的介入点 */}
            <HumanRolesSummary />

            <div style={{ fontSize: 12, color: "#475569", marginBottom: 14, lineHeight: 1.6 }}>
              点击每步查看：触发条件、agent 做什么、读写哪些文件（含原因）、产出、失败怎么办。
            </div>

            {/* 七步交付链 */}
            <Section title="七步交付链">
              {FLOW_STEPS.map((step, i) => (
                <div key={step.id}>
                  <div
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                      borderRadius: expandedStep === step.id ? "10px 10px 0 0" : 10,
                      backgroundColor: expandedStep === step.id ? `${step.color}10` : "#0f172a",
                      border: `1px solid ${expandedStep === step.id ? step.color + "40" : "#1e293b"}`,
                      cursor: "pointer", transition: "all 0.15s",
                      borderBottom: expandedStep === step.id ? "none" : undefined,
                    }}
                    onMouseEnter={e => { if (expandedStep !== step.id) e.currentTarget.style.borderColor = "#334155"; }}
                    onMouseLeave={e => { if (expandedStep !== step.id) e.currentTarget.style.borderColor = "#1e293b"; }}
                  >
                    <span style={{ fontSize: 14, width: 28, height: 28, borderRadius: "50%", backgroundColor: `${step.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{step.label}</span>
                        {step.skill && <Tag color="#64748b">{step.skill}</Tag>}
                        {step.humanGate && <Tag color="#ec4899">人工确认</Tag>}
                        {step.isRetry && <Tag color="#f59e0b">失败重试</Tag>}
                        {step.isAgentLoop && <Tag color="#10b981">Agent 循环</Tag>}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 1 }}>{step.summary}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "#334155", transform: expandedStep === step.id ? "rotate(90deg)" : "", transition: "transform 0.15s" }}>▸</span>
                  </div>
                  {expandedStep === step.id && <FlowStepDetail step={step} />}
                  {i < FLOW_STEPS.length - 1 && <div style={{ width: 2, height: 6, backgroundColor: "#1e293b", margin: "0 auto" }} />}
                </div>
              ))}
            </Section>

            {/* 改进飞轮 */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 8 }}>改进飞轮</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                {[
                  { t: "Agent 犯错", c: "#ef4444" },
                  { t: "Harness 为何没拦住？", c: "#f59e0b" },
                  { t: "新 Invariant", c: "#3b82f6" },
                  { t: "新 Check Script", c: "#06b6d4" },
                  { t: "Eval 更新", c: "#8b5cf6" },
                  { t: "下次自动拦截", c: "#22c55e" },
                ].map((s, i, a) => (
                  <div key={i} style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, backgroundColor: `${s.c}10`, border: `1px solid ${s.c}25`, color: s.c }}>{s.t}</span>
                    {i < a.length - 1 && <span style={{ color: "#1e293b", margin: "0 2px", fontSize: 10 }}>→</span>}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#22c55e" }}>↻</span> 每次循环，harness 更强一层，agent 能稳定完成的任务边界更大一点
              </div>
            </Card>

            {/* 图例 */}
            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: "#475569", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>图例</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: "#1e3a5f", color: "#7dd3fc", fontFamily: "'DM Mono', monospace" }}>path</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>agent 读取</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 4, backgroundColor: "#1a3329", color: "#6ee7b7", fontFamily: "'DM Mono', monospace" }}>path</span>
                  <span style={{ fontSize: 11, color: "#64748b" }}>agent 写入</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Tag color="#ec4899">人工确认</Tag>
                  <span style={{ fontSize: 11, color: "#64748b" }}>需要人介入</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Tag color="#f59e0b">失败重试</Tag>
                  <span style={{ fontSize: 11, color: "#64748b" }}>自动修复循环</span>
                </div>
              </div>
            </Card>

            {/* 核心原则 */}
            <Card style={{ border: "1px solid #22c55e20", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#22c55e", marginBottom: 6 }}>核心原则</div>
              <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                人只在两个节点做决策：<strong style={{ color: "#e2e8f0" }}>确认 Spec</strong>（方向对不对）和 <strong style={{ color: "#e2e8f0" }}>Review Diff</strong>（实现对不对）。
                其余全部由 agent 执行 + 机械验证。每次循环结束后，harness-sync 把新知识沉淀回 harness/，下次需求的 agent 就更强。
              </div>
            </Card>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", fontSize: 10, color: "#0f172a", padding: "20px 0 12px" }}>
          Harness Engineering Operating Model
        </div>
      </div>
    </div>
  );
}
