import { deploy, instantiate } from "../../scripts/utils";

const WASM_FILE = "nft_launchpad.wasm";
const DEPLOYER = "tori1jy6umm9k0zhlte4gefmxneqgr4kpltxw6uew3x";

const main = async () => {
  const codeId = await deploy(WASM_FILE);
  const initMsg = {
    config: {
      name: "Teritori launchpad",
      supported_networks: [],
      nft_code_id: 12,
      deployer: DEPLOYER,
    },
  };
  const contractAddress = await instantiate(
    codeId,
    "Teritori Launchpad",
    initMsg,
  );

  console.log("CodeId:", codeId, "- Contract Address:", contractAddress);
};

main();
