import child_process from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import process from "process";

const dirsToExclude = ["node_modules", ".git", "cache"];
const excludePatterns = ["*.env", "Dockerfile", "docker-compose.yml", "*.md"];

const varNameToFlagName = (varName: string) => {
  return varName.toLowerCase().replaceAll("_", "-");
};

const projectRoot = path.join(__dirname, "../..");

const envFiles = fs
  .readdirSync(projectRoot)
  .filter((f) => f.endsWith(".env"))
  .map((f) => path.join(projectRoot, f));

const envVars: string[] = [];
for (const envFilePath of envFiles) {
  const env = dotenv.parse(fs.readFileSync(envFilePath));
  envVars.push(...Object.keys(env));
}

const toFind = [...envVars, ...envVars.map(varNameToFlagName)];

const cmd = `grep -R -E --no-filename ${excludePatterns
  .map((p) => `--exclude '${p}'`)
  .join(" ")} ${dirsToExclude
  .map((d) => `--exclude-dir '${d}'`)
  .join(" ")} '${toFind.join("|")}' '${projectRoot}'`;

console.log("Running command:");
console.log(cmd);

const grepOut = child_process.execSync(cmd);
const grepLines = grepOut
  .toString("utf-8")
  .split("\n")
  .map((l) => l.trim());

// console.log(grepLines.join("\n"));

const remainingToFind = new Set(envVars);

for (const line of grepLines) {
  for (const f of remainingToFind) {
    if (line.includes(f) || line.includes(varNameToFlagName(f))) {
      remainingToFind.delete(f);
    }
  }
}

if (remainingToFind.size > 0) {
  console.error("ERROR: Unused environment variables:");
  for (const f of remainingToFind) {
    console.error(f);
  }
  process.exit(1);
}

console.log(
  "SUCESS: No unused environment variables found, but there might be false negatives",
);
