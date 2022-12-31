// FIXME: use contract parameter instead of hardcoded list

import { Collection } from "../api/marketplace/v1/marketplace";

export const secondaryDuringMintList = [
  `tori-${process.env.TERITORI_NAME_SERVICE_CONTRACT_ADDRESS}`, // TNS
  "tori-tori1r8raaqul4j05qtn0t05603mgquxfl8e9p7kcf7smwzcv2hc5rrlq0vket0", // Teritori's pets
  "tori-tori167xst2jy9n6u92t3n8hf762adtpe3cs6acsgn0w5n2xlz9hv3xgs4ksc6t", // Diseases of the Brain AI
  "tori-tori1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37", // RIOT gen 1
];

export const launchpadCollectionsFilter = (c: Collection): boolean => {
  return ![
    "tori-tori1gflccmghzfscmxl95z43v36y0rle8v9x8kvt9na03yzywtw86amsj9nf37", // RIOT gen 1
  ].includes(c.id);
};
