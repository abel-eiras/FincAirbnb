import { execSync } from "node:child_process";

const branchFromCI = process.env.GITHUB_HEAD_REF || process.env.CI_COMMIT_REF_NAME;
const isCI = Boolean(process.env.GITHUB_ACTIONS || process.env.CI);
const currentBranch =
  branchFromCI ||
  execSync("git branch --show-current", { encoding: "utf8" }).trim();

const allowedPrefixes = "feat|fix|chore|docs|refactor|test|ci|build";
const branchRegex = new RegExp(
  `^(${allowedPrefixes})\\/[A-Za-z0-9._-]+-frontend-[A-Za-z0-9._-]+$`
);

if (!currentBranch) {
  console.error("Non se puido determinar a rama actual.");
  process.exit(1);
}

if (["main", "master", "develop"].includes(currentBranch)) {
  if (isCI) {
    console.log(`Rama protegida permitida en CI: ${currentBranch}`);
    process.exit(0);
  }
  console.error(
    `Commit bloqueado: evita commits directos en '${currentBranch}'. Usa unha rama feature/fix.`
  );
  process.exit(1);
}

if (!branchRegex.test(currentBranch)) {
  console.error(
    `Rama inválida: '${currentBranch}'. Formato esperado: <type>/<ticket>-frontend-<descricion>.`
  );
  process.exit(1);
}

console.log(`Rama válida: ${currentBranch}`);
