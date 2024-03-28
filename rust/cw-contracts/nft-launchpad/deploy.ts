import { deploy, instantiate } from "../utils";

const WASM_FILE = "nft_launchpad.wasm";

const main = async () => {
  const codeId = await deploy(WASM_FILE);
  const initMsg = {
    config: { name: "Teritori launchpad", supported_networks: [] },
  };
  const contractAddress = await instantiate(
    codeId,
    "Teritori Launchpad",
    initMsg,
  );

  console.log("CodeId:", codeId, "- Contract Address:", contractAddress);
};

main();
