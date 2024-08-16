import child_process from "child_process";
import { program } from "commander";

const main = async () => {
  program.argument("<pkgname>", "Name of contract package to build");
  program.parse();
  const [pkgname] = program.args as [string];

  const buildCmd = `docker run -p linux/amd64 --rm -v ./:/code \
  --mount type=volume,source="${pkgname}_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0 ./rust/cw-contracts/${pkgname}`;

  child_process.execSync(buildCmd, { stdio: "inherit" });
};

main();
