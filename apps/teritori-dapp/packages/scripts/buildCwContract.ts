import child_process from "child_process";
import { program } from "commander";
import path from "path";

import sqh from "./sqh";

const main = async () => {
  program.argument("<pkgname>", "Name of contract package to build");
  program.parse();
  const [pkgname] = program.args as [string];

  const dir = path.join("rust/cw-contracts", pkgname);

  const buildCmd = `docker run --platform linux/amd64 --rm -v ./:/code \
  --mount type=volume,source=${sqh(`teritori-dapp_cw_${pkgname}_cache`)},target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0 ${sqh(dir)}`;

  child_process.execSync(buildCmd, { stdio: "inherit" });
};

main();
