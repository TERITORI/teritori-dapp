import { deploy, instantiate } from "../utils";

const WASM_FILE = "nft_tr721.wasm";

const main = async () => {
  const codeId = await deploy(WASM_FILE);
  const initMsg = {
    config: { name: "NFT Tr721", supported_networks: [] },
  };
  const contractAddress = await instantiate(
    codeId,
    "Teritori Launchpad",
    initMsg,
  );

  console.log("CodeId:", codeId, "- Contract Address:", contractAddress);
};

main();
