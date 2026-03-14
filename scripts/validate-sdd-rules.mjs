import { execSync } from "node:child_process";

const staged = execSync("git diff --cached --name-only", {
  encoding: "utf8"
})
  .split("\n")
  .map((f) => f.trim())
  .filter(Boolean);

const hasFunctionalChanges = staged.some((file) =>
  /^(app|components|services|contexts|shared\/types)\//.test(file)
);

if (!hasFunctionalChanges) {
  console.log("Non hai cambios funcionais staged. SDD check omitido.");
  process.exit(0);
}

const hasSpecUpdate = staged.some(
  (file) =>
    file.startsWith("specs/") ||
    file === "docs/development/SDD_PR_CHECKLIST.md" ||
    file === "docs/development/API_CONTRACT_ALIGNMENT.md"
);

if (!hasSpecUpdate) {
  console.error(
    "Commit bloqueado: detectáronse cambios funcionais sen actualización de specs/trazabilidade."
  );
  console.error("Inclúe cambios en 'specs/' antes de commit.");
  process.exit(1);
}

console.log("SDD check OK: hai actualización de specs/trazabilidade.");
