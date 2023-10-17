import { allNetworks } from "../networks";

const main = async () => {
  for (const n of allNetworks) {
    console.log(n);
  }
};

main();
