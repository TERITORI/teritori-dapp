import { Secp256k1HdWallet } from "@cosmjs/amino";
import { OfflineSigner } from "@cosmjs/proto-signing";
import child_process from "child_process";
import fs from "fs/promises";
import { Listr } from "listr2";
import os from "os";
import path from "path";

import { cloneRepo } from "./git";
import { zodTryParseJSON } from "../../utils/sanitize";
import {
  execPromise,
  killProcess,
  mustGetAttr,
  replaceInFile,
  sleep,
  zodTxResult,
} from "../lib";

export const startCosmosLocalnet = async (
  binaryPath: string,
  opts?: {
    height?: bigint;
    home?: string;
  },
) => {
  let height = opts?.height;
  if (!height) {
    height = BigInt(0);
  }
  const version = (
    await execPromise(`${binaryPath} version`, { encoding: "utf-8" })
  ).stderr.trim();
  console.log(`🧱 Starting localnet version ${version} at height ${height}`);
  let home = opts?.home;
  let admSigner: OfflineSigner | undefined;
  if (!home) {
    home = await fs.mkdtemp(path.join(os.tmpdir(), "cosmos-home-"));
    // run teritorid init --chain-id=testing testing --home=$HOME/.teritorid
    const initCmd = `${binaryPath} init testing --chain-id testing --home ${home}`;
    console.log("⚙️  " + initCmd);
    await execPromise(initCmd);

    await replaceInFile(
      path.join(home, "config", "genesis.json"),
      `"voting_period": "172800s"`,
      `"voting_period": "20s"`,
    );

    await replaceInFile(
      path.join(home, "config", "genesis.json"),
      /stake"/g,
      `utori"`,
    );

    // run teritorid keys add validator --keyring-backend=test --home=$HOME/.teritorid
    const addValidatorCmd = `${binaryPath} keys add validator --keyring-backend=test --home ${home}`;
    console.log("⚙️  " + addValidatorCmd);
    await execPromise(addValidatorCmd);
    // run teritorid add-genesis-account $(teritorid keys show validator -a --keyring-backend=test --home=$HOME/.teritorid) 100000000000utori,100000000000stake --home=$HOME/.teritorid
    const addGenesisAccountCmd = `${binaryPath} add-genesis-account $(${binaryPath} keys show validator -a --keyring-backend=test --home ${home}) 100000000000000000utori --home ${home}`;
    console.log("⚙️  " + addGenesisAccountCmd);
    await execPromise(addGenesisAccountCmd);
    // run teritorid keys add testnet-adm --keyring-backend=test --home=$HOME/.teritorid
    const addTestnetAdmCmd = `${binaryPath} keys add testnet-adm --keyring-backend=test --home ${home}`;
    console.log("⚙️  " + addTestnetAdmCmd);
    const { stderr } = await execPromise(addTestnetAdmCmd);
    const resParts = stderr
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => !!s);
    const admMnemonicString = resParts[resParts.length - 1];
    console.log("🔑 testnet-adm mnemonic: " + admMnemonicString);
    admSigner = await Secp256k1HdWallet.fromMnemonic(admMnemonicString, {
      prefix: "tori",
    });
    // run teritorid add-genesis-account $(teritorid keys show validator -a --keyring-backend=test --home=$HOME/.teritorid) 100000000000utori,100000000000stake --home=$HOME/.teritorid
    const addTestnetAdmGenesisAccountCmd = `${binaryPath} add-genesis-account $(${binaryPath} keys show testnet-adm -a --keyring-backend=test --home ${home}) 100000000000000000utori --home ${home}`;
    console.log("⚙️  " + addTestnetAdmGenesisAccountCmd);
    await execPromise(addTestnetAdmGenesisAccountCmd);
    // run teritorid gentx validator 500000000stake --keyring-backend=test --home=$HOME/.teritorid --chain-id=testing
    const gentxCmd = `${binaryPath} gentx validator 500000000utori --keyring-backend=test --home ${home} --chain-id=testing`;
    console.log("⚙️  " + gentxCmd);
    await execPromise(gentxCmd);
    // run teritorid collect-gentxs --home=$HOME/.teritorid
    const collectGentxsCmd = `${binaryPath} collect-gentxs --home ${home}`;
    console.log("⚙️  " + collectGentxsCmd);
    await execPromise(collectGentxsCmd);
  }
  const cmd = `${binaryPath} start --home ${home}`;
  console.log("⚙️  " + cmd);

  const ac = new AbortController();
  const result = execPromise(cmd, {
    encoding: "utf-8",
  });
  const p = result.child;
  await waitForHeight(26657, height + BigInt(1));
  console.log(`🏠 Started localnet version ${version}`);
  return {
    admSigner,
    home,
    validatorWalletName: "validator",
    result,
    process: p,
    ac,
    kill: async () => {
      try {
        await killProcess(p, result);
      } catch (e) {
        throw e;
      }
    },
  };
};

const waitForHeight = async (port: number, targetHeight: bigint) => {
  const statusCmd = `curl -s http://localhost:${port}/status`;
  console.log("⏳ Waiting for height " + targetHeight);
  while (true) {
    try {
      const result = await execPromise(statusCmd);
      // eslint-disable-next-line no-restricted-syntax
      const status = JSON.parse(result.stdout);
      const height = BigInt(status.result.sync_info.latest_block_height);
      //console.log(`height: ${height}`);
      if (height < targetHeight) {
        throw new Error("height not reached");
      }
      break;
    } catch {}
    await sleep(1000);
  }
  console.log("Reached height " + targetHeight);
};

export const upgradeCosmosLocalnet = async (
  oldBinaryPath: string,
  newVersion: string,
  validatorWalletName: string,
  home: string,
) => {
  console.log("⬆️  Upgrading chain to " + newVersion);

  // get height
  const statusCmd = `curl -s http://localhost:26657/status`;
  console.log("⚙️  " + statusCmd);
  // eslint-disable-next-line no-restricted-syntax
  const status = JSON.parse(
    (await execPromise(statusCmd, { encoding: "utf-8" })).stdout,
  );
  let height = BigInt(status.result.sync_info.latest_block_height);
  height += BigInt(8);

  /* run teritorid140 tx gov submit-proposal software-upgrade "v2.0.0" \
    --upgrade-height=10 \
    --title="Upgrade to v2.0.0" --description="Upgrade to v2.0.0" \
    --from=validator --keyring-backend=test \
    --chain-id=testing --home=$HOME/.teritorid --yes -b block --deposit="100000000stake"
  */
  const cmd = `${oldBinaryPath} tx gov submit-proposal software-upgrade "${newVersion}" --upgrade-height=${height} --title="Upgrade to ${newVersion}" --description="Upgrade to ${newVersion}" --from=${validatorWalletName} --keyring-backend=test --chain-id=testing --home=${home} --yes -b block --deposit="500000000utori" --node http://127.0.0.1:26657 -o json`;
  console.log("⚙️  " + cmd);
  const { stdout: out } = await execPromise(cmd, { encoding: "utf-8" });
  const outObj = zodTryParseJSON(zodTxResult, out);
  if (!outObj) {
    throw new Error("Failed to parse submit-proposal result");
  }
  const proposalId = mustGetAttr(outObj, "submit_proposal", "proposal_id");

  /* run teritorid140 tx gov vote 1 yes --from validator --chain-id testing \
    --home $HOME/.teritorid -b block -y --keyring-backend test
  */
  const voteCmd = `${oldBinaryPath} tx gov vote ${proposalId} yes --from ${validatorWalletName} --chain-id testing --home ${home} -b block -y --keyring-backend test  --node http://127.0.0.1:26657`;
  console.log("⚙️  " + voteCmd);
  await execPromise(voteCmd);

  await waitForHeight(26657, height);

  // check proposal status
  const proposalCmd = `${oldBinaryPath} query gov proposal ${proposalId} --chain-id testing --home ${home} -o json --node http://127.0.0.1:26657`;
  console.log("⚙️  " + proposalCmd);
  const { stdout: proposalOut } = await execPromise(proposalCmd, {
    encoding: "utf-8",
  });
  // TODO: compare date
  // console.log(new Date());
  // eslint-disable-next-line no-restricted-syntax
  const proposalOutObj = JSON.parse(proposalOut);
  // console.log(proposalOutObj);
  if (proposalOutObj.status !== "PROPOSAL_STATUS_PASSED") {
    throw new Error("Proposal not passed");
  }

  console.log("🆙 Upgraded chain to " + newVersion);

  return height;
};

export const buildCosmos = async (
  repoPath: string,
  binaryName: string,
): Promise<string> => {
  const cmd = `cd ${repoPath} && make build`;
  // console.log("⚙️  " + cmd);
  await new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(stdout + stderr));
      } else {
        resolve(undefined);
      }
    });
  });
  return path.join(repoPath, "build", binaryName);
};

type TupleToObject<T extends readonly string[], V> = {
  [P in T[number]]: V;
};

export const buildBinaries = async <V extends readonly string[]>(
  repoURL: string,
  binaryName: string,
  versions: V,
): Promise<TupleToObject<V, string>> => {
  const binaries: { [version: string]: string } = {};
  const tasks = new Listr(
    versions.map((v) => {
      return {
        title: `build ${binaryName} ${v}`,
        task: async () => {
          const repoPath = await cloneRepo(repoURL, v);
          const builtBinaryPath = await buildCosmos(repoPath, binaryName);
          const finalDir = await fs.mkdtemp(
            path.join(os.tmpdir(), `${binaryName}-${v}-`),
          );
          const finalPath = path.join(finalDir, binaryName);
          await fs.copyFile(builtBinaryPath, finalPath);
          await fs.rm(repoPath, { recursive: true, force: true });
          binaries[v] = finalPath;
        },
      };
    }),
    {
      concurrent: true,
      exitOnError: false,
    },
  );
  await tasks.run();
  if (tasks.tasks.some((t) => t.state === "FAILED")) {
    console.error("Failed");
    process.exit(1);
  }
  return binaries as TupleToObject<V, string>; // FIXME: make this type safe
};
