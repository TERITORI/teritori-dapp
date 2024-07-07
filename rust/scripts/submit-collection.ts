import { getClientInfos } from "./utils";

// import { getLaunchpadClient } from "@/utils/backend";

const main = async () => {
  // const networkId = "teritori-testnet";
  const {
    // wallet,
    client,
    sender,
  } = await getClientInfos();

  client.console.log({ client, sender });
};

main();
