import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const scanRoots = ["app", "components"];
const allowedExtensions = new Set([".ts", ".tsx", ".js", ".jsx"]);

const forbiddenGlobalPatterns = [
  { regex: /href=["']#["']/g, message: "Evitar enlaces placeholder href=\"#\"." },
  { regex: /\/taboleiro\/miñas-fincas/g, message: "Ruta antiga: usar /taboleiro/minas-fincas." },
  { regex: /\/fincas\/\$\{[^}]+\}\/avaliar/g, message: "Ruta antiga: usar /alugamentos/${id}/valorar." },
];

const forbiddenByPath = [
  {
    pathIncludes: "components/HeroSection.tsx",
    regex: /window\.location\.href/g,
    message: "HeroSection debe usar navegación cliente (router.push o Link).",
  },
  {
    pathIncludes: "components/dashboard/labrego/",
    regex: /window\.location\.href/g,
    message: "Dashboard labrego debe evitar recargas completas (window.location.href).",
  },
];

function collectFiles(startPath) {
  const absoluteStart = path.join(root, startPath);
  if (!fs.existsSync(absoluteStart)) return [];

  const out = [];
  const stack = [absoluteStart];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === ".git") {
        continue;
      }

      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }

      if (allowedExtensions.has(path.extname(entry.name))) {
        out.push(fullPath);
      }
    }
  }

  return out;
}

const files = scanRoots.flatMap(collectFiles);
const violations = [];

for (const file of files) {
  const relativePath = path.relative(root, file).replaceAll("\\", "/");
  const content = fs.readFileSync(file, "utf8");

  for (const rule of forbiddenGlobalPatterns) {
    if (rule.regex.test(content)) {
      violations.push(`${relativePath}: ${rule.message}`);
    }
  }

  for (const rule of forbiddenByPath) {
    if (relativePath.includes(rule.pathIncludes) && rule.regex.test(content)) {
      violations.push(`${relativePath}: ${rule.message}`);
    }
  }
}

if (violations.length > 0) {
  console.error("Frontend guard: atopáronse patróns prohibidos.");
  for (const violation of violations) {
    console.error(` - ${violation}`);
  }
  process.exit(1);
}

console.log(`Frontend guard OK: ${files.length} ficheiros revisados.`);
