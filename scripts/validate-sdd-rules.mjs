/**
 * Antes se exixía cambiar specs/ xunto a código; para o repo público
 * só avisamos se queres manter o contrato alineado.
 */
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
  process.exit(0);
}

const touchedContract = staged.includes("docs/development/API_CONTRACT_ALIGNMENT.md");

if (!touchedContract) {
  console.warn(
    "[SDD] Hai cambios funcionais; considera actualizar docs/development/API_CONTRACT_ALIGNMENT.md se cambiou a API."
  );
}

process.exit(0);
