import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { program } from "commander";

const main = async () => {
  program
    .argument("<realm>", "realm package path")
    .argument("[path]", "render path", "")
    .option(
      "-n, --node [string]",
      "gnoland rpc endpoint",
      "http://localhost:26657",
    )
    .parse();
  const [realmPkgPath, renderPath] = program.args;
  const { node } = program.opts();

  const client = new GnoJSONRPCProvider(node);
  const output = await client.getRenderOutput(realmPkgPath, renderPath);
  console.log(output);
};

main();
