import { spawn } from "node:child_process";
import path from "node:path";

const [command = "dev", ...args] = process.argv.slice(2);
const cli = path.resolve("node_modules/vinext/dist/cli.js");
const child = spawn(process.execPath, [cli, command, ...args], {
  stdio: "inherit",
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
