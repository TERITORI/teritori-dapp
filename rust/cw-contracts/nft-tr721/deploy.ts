import { deploy } from "../../utils/scripts";

const WASM_FILE = "nft_tr721-aarch64.wasm";

const main = async () => {
  const codeId = await deploy(WASM_FILE);
  console.log("CodeId:", codeId);
};

main();
