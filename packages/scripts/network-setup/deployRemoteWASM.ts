import axios from "axios";
import fs from "fs";
import path from "path";

import { DeployOpts, storeWASM } from "./deployLib";

import { CosmosNetworkInfo } from "@/networks";

export const deployRemoteWASM = async (
  opts: DeployOpts,
  wallet: string,
  network: CosmosNetworkInfo,
  url: string,
  name: string,
) => {
  console.log(`Fetching ${url}`);
  const contractsDir = path.join(opts.home, "remote-wasm");
  fs.mkdirSync(contractsDir, { recursive: true });
  const filePath = path.join(contractsDir, name);
  const response = await axios.get(url, { responseType: "stream" });
  const fileStream = fs.createWriteStream(filePath);
  await response.data.pipe(fileStream);
  console.log(`Storing ${filePath}`);
  return await storeWASM(opts, wallet, network, filePath);
};
