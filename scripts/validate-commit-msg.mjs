import { readFileSync } from "node:fs";

const commitMsgFile = process.argv[2];
if (!commitMsgFile) {
  console.error("Falta o ficheiro de mensaxe de commit.");
  process.exit(1);
}

const message = readFileSync(commitMsgFile, "utf8").trim();
const regex = /^(feat|fix|docs|chore|refactor|test|ci|build)\([a-z0-9._-]+\): .+/;

if (!regex.test(message)) {
  console.error("Formato de commit inválido.");
  console.error("Usa: type(scope): mensaxe");
  console.error("Exemplo: feat(frontend): engade validación de contrato");
  process.exit(1);
}

console.log("Commit message válida.");
