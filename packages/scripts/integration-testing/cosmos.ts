import child_process from "child_process";
import fs from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import util from "util";

import { sleep } from "../lib";

export const startCosmosLocalnet = async (
  binaryPath: string,
  opts?: {
    height?: bigint;
    home?: string;
  },
) => {
  let home = opts?.home;
  if (!home) {
    home = await fs.mkdtemp(path.join(tmpdir(), "cosmos-home-"));
    // run teritorid init --chain-id=testing testing --home=$HOME/.teritorid
    const initCmd = `${binaryPath} init testing --chain-id testing --home ${home}`;
    console.log("> " + initCmd);
    child_process.execSync(initCmd, { stdio: "ignore" });
    // run teritorid keys add validator --keyring-backend=test --home=$HOME/.teritorid
    const addValidatorCmd = `${binaryPath} keys add validator --keyring-backend=test --home ${home}`;
    console.log("> " + addValidatorCmd);
    child_process.execSync(addValidatorCmd);
    // run teritorid add-genesis-account $(teritorid keys show validator -a --keyring-backend=test --home=$HOME/.teritorid) 100000000000utori,100000000000stake --home=$HOME/.teritorid
    const addGenesisAccountCmd = `${binaryPath} add-genesis-account $(${binaryPath} keys show validator -a --keyring-backend=test --home ${home}) 100000000000000000utori,100000000000000000stake --home ${home}`;
    console.log("> " + addGenesisAccountCmd);
    child_process.execSync(addGenesisAccountCmd);
    // run teritorid keys add testnet-adm --keyring-backend=test --home=$HOME/.teritorid
    const addTestnetAdmCmd = `${binaryPath} keys add testnet-adm --keyring-backend=test --home ${home}`;
    console.log("> " + addTestnetAdmCmd);
    child_process.execSync(addTestnetAdmCmd);
    // run teritorid add-genesis-account $(teritorid keys show validator -a --keyring-backend=test --home=$HOME/.teritorid) 100000000000utori,100000000000stake --home=$HOME/.teritorid
    const addTestnetAdmGenesisAccountCmd = `${binaryPath} add-genesis-account $(${binaryPath} keys show testnet-adm -a --keyring-backend=test --home ${home}) 100000000000000000utori,100000000000000000stake --home ${home}`;
    console.log("> " + addTestnetAdmGenesisAccountCmd);
    child_process.execSync(addTestnetAdmGenesisAccountCmd);
    // run teritorid gentx validator 500000000stake --keyring-backend=test --home=$HOME/.teritorid --chain-id=testing
    const gentxCmd = `${binaryPath} gentx validator 500000000stake --keyring-backend=test --home ${home} --chain-id=testing`;
    console.log("> " + gentxCmd);
    child_process.execSync(gentxCmd);
    // run teritorid collect-gentxs --home=$HOME/.teritorid
    const collectGentxsCmd = `${binaryPath} collect-gentxs --home ${home}`;
    console.log("> " + collectGentxsCmd);
    child_process.execSync(collectGentxsCmd);
  }
  const cmd = `${binaryPath} start --home ${home}`;
  console.log("> " + cmd);

  const result = util.promisify(child_process.exec)(cmd, {
    encoding: "utf-8",
  });
  let height = opts?.height;
  if (!height) {
    height = 0n;
  }
  await waitForHeight(26657, height + 1n);
  return {
    home,
    validatorWalletName: "validator",
    result,
    process: result.child,
  };
};

export const waitForHeight = async (port: number, targetHeight: bigint) => {
  const statusCmd = `curl -s http://localhost:26657/status`;
  console.log("> " + statusCmd);
  while (true) {
    try {
      // eslint-disable-next-line no-restricted-syntax
      const status = JSON.parse(child_process.execSync(statusCmd).toString());
      const height = BigInt(status.result.sync_info.latest_block_height);
      if (height < targetHeight) {
        throw new Error("height not reached");
      }
      break;
    } catch {}
    await sleep(1000);
  }
};

export const upgradeCosmosLocalnet = async (
  oldBinaryPath: string,
  newVersion: string,
  validatorWalletName: string,
  home: string,
) => {
  // get height
  const statusCmd = `curl -s http://localhost:26657/status`;
  console.log("> " + statusCmd);
  // eslint-disable-next-line no-restricted-syntax
  const status = JSON.parse(child_process.execSync(statusCmd).toString());
  let height = BigInt(status.result.sync_info.latest_block_height);
  height += 5n;

  /* run teritorid140 tx gov submit-proposal software-upgrade "v2.0.0" \
    --upgrade-height=10 \
    --title="Upgrade to v2.0.0" --description="Upgrade to v2.0.0" \
    --from=validator --keyring-backend=test \
    --chain-id=testing --home=$HOME/.teritorid --yes -b block --deposit="100000000stake"
  */
  const cmd = `${oldBinaryPath} tx gov submit-proposal software-upgrade "${newVersion}" --upgrade-height=${height} --title="Upgrade to ${newVersion}" --description="Upgrade to ${newVersion}" --from=${validatorWalletName} --keyring-backend=test --chain-id=testing --home=${home} --yes -b block --deposit="100000000stake" --node http://127.0.0.1:26657`;
  console.log("> " + cmd);
  child_process.execSync(cmd);

  /* run teritorid140 tx gov vote 1 yes --from validator --chain-id testing \
    --home $HOME/.teritorid -b block -y --keyring-backend test
  */
  const voteCmd = `${oldBinaryPath} tx gov vote 1 yes --from ${validatorWalletName} --chain-id testing --home ${home} -b block -y --keyring-backend test  --node http://127.0.0.1:26657`;
  console.log("> " + voteCmd);
  child_process.execSync(voteCmd);

  return height;
};
