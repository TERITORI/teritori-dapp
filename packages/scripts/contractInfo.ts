import { mustGetNonSigningCosmWasmClient } from "../networks";

const networkId = "teritori-testnet";
const contractAddr =
  "tori1f68mefk7hdmq0eux26sypegfdq3xamnps8ujnc4xd4juwfjscnus5aelck";

const main = async () => {
  const client = await mustGetNonSigningCosmWasmClient(networkId);
  const contract = await client.getContract(contractAddr);
  console.log(contract);
  try {
    const { info } = await client.queryContractSmart(contractAddr, {
      info: {},
    });
    console.log(info);
  } catch {}
};

main();
