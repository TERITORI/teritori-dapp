import { program } from "commander";

import { deployTeritoriEcosystem } from "./deployLib";

const main = async () => {
  program.argument("<network-id>", "Network id to deploy to");
  program.argument("<wallet>", "Wallet to deploy from");
  program.parse();
  const [networkId, wallet] = program.args;

  const network = await deployTeritoriEcosystem(
    { home: "~/.teritorid", binaryPath: "teritorid", signer: undefined },
    networkId,
    wallet,
  );

  console.log(JSON.stringify(network, null, 2));
};

main();
