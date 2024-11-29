import child_process from "child_process";
import { program } from "commander";

import { getGnoNetwork } from "@/networks";

const main = async () => {
  program.option("-n, --network <network>", "network");
  program.option("-w, --wallet <wallet>", "wallet");
  program.option("-p, --pkgpath <pkgpath>", "package path");
  program.option("-d, --pkgdir <pkgdir>", "package directory");
  program.parse();
  const { network: networkId, wallet, pkgpath, pkgdir } = program.opts();

  const network = getGnoNetwork(networkId);
  if (!network) {
    console.error(`Network "${networkId}" not found`);
    return;
  }

  const cmd = `gnokey maketx addpkg \
    --pkgpath "${pkgpath}" \
    --pkgdir "${pkgdir}" \
    --gas-fee 1ugnot \
    --gas-wanted 10000000 \
    --broadcast \
    --chainid "${network.chainId}" \
    --remote "${network.endpoint}" \
    ${wallet}`;
  child_process.execSync(cmd, { stdio: "inherit" });
};

main();
