// Read-only office views for a company-scoped desk.
export const OPS_TOOLS = [
  {
    name: "ops_overview",
    description: "Read-only overview of the office across all floors and recent runs.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "ops_runs",
    description: "Read-only recent runs for one floor, newest first.",
    inputSchema: { type: "object", properties: { team: { type: "string" }, limit: { type: "integer" } }, required: ["team"] },
  },
  {
    name: "ops_thread",
    description: "Read-only conversation from one floor. Set tools to true to include tool calls.",
    inputSchema: { type: "object", properties: { team: { type: "string" }, thread_id: { type: "string" }, limit: { type: "integer" }, tools: { type: "boolean" } }, required: ["team", "thread_id"] },
  },
  {
    name: "ops_log",
    description: "Read-only GitHub Actions log for a run, optionally filtered by a regex.",
    inputSchema: { type: "object", properties: { gh_run: { type: "string" }, grep: { type: "string" }, tail: { type: "integer" } }, required: ["gh_run"] },
  },
  {
    name: "ops_transcript",
    description: "Read-only saved runner transcript for one floor and run.",
    inputSchema: { type: "object", properties: { team: { type: "string" }, run: { type: "string" }, from: { type: "integer" }, tail: { type: "integer" } }, required: ["team", "run"] },
  },
  {
    name: "ops_proposals",
    description: "Read-only list of proposal branches awaiting owner review.",
    inputSchema: { type: "object", properties: {} },
  },
];

const ROUTES = Object.fromEntries(OPS_TOOLS.map((tool) => [tool.name, tool.name.slice(4)]));

export async function callOps(name, args, { office, team, runId, token, fetch }) {
  const route = ROUTES[name];
  if (!route) throw new Error(`unknown ops tool ${name}`);
  const url = new URL(`${office.replace(/\/$/, "")}/api/runner/ops/${route}`);
  // team/run authenticate this session; the floor and the run it looks at travel as target/source_run (the Worker reads those names).
  url.searchParams.append("team", team);
  url.searchParams.append("run", runId);
  const names = { team: "target", run: "source_run", thread_id: "id" };
  for (const [key, value] of Object.entries(args ?? {})) {
    if (value === undefined || value === null) continue;
    url.searchParams.append(names[key] ?? key, typeof value === "boolean" ? (value ? "1" : "0") : String(value));
  }
  const response = await fetch(url.toString(), { headers: { "X-Run-Token": token } });
  return (await response.text()).slice(0, 60_000);
}
