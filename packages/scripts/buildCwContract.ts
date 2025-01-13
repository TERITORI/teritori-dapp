import child_process from "child_process";
import { program } from "commander";
import path from "path";
import fs from "fs"
import process from "process"

import sqh from "./sqh";

const main = async () => {
  program.argument("<pkgname>", "Name of contract package to build");
  program.parse();
  const [pkgname] = program.args as [string];

  const contractsDir = path.join(__dirname, "..", "..", "rust", "cw-contracts")
  const dir = path.join(contractsDir, pkgname);
  if (!fs.existsSync(dir)) {
    console.error(`ERROR: package ${JSON.stringify(pkgname)} not found in ${JSON.stringify(contractsDir)}, must be one of: ${fs.readdirSync(contractsDir).map((v) => JSON.stringify(v)).join(", ")}`)
    process.exit(1)
  }

  const buildCmd = `docker run --platform linux/amd64 --rm -v ./:/code \
  --mount type=volume,source=${sqh(`teritori-dapp_cw_${pkgname}_cache`)},target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.1 ${sqh(`./rust/cw-contracts/${pkgname}`)}`;
  console.log("+ " + buildCmd)
  child_process.execSync(buildCmd, { stdio: "inherit" });
};

main();
