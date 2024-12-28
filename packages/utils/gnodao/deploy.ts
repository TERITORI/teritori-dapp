import { adenaAddPkg } from "../gno";
import { DaoType } from "../types/organizations";
import { generateMembershipDAOSource } from "./generateMembershipDAOSource";
import { generateRolesDAOSource } from "./generateRolesDAOSource";

interface GnoDAOMember {
  address: string;
  weight: number;
  roles: string[];
}

interface GnoDAORole {
  name: string;
  color: string;
  resources: string[] | undefined;
}

export interface GnoDAOConfig {
  name: string;
  maxVotingPeriodSeconds: number;
  roles: GnoDAORole[] | undefined;
  initialMembers: GnoDAOMember[];
  thresholdPercent: number;
  quorumPercent: number;
  displayName: string;
  description: string;
  imageURI: string;
}

export const adenaDeployGnoDAO = async (
  networkId: string,
  creator: string,
  structure: DaoType,
  conf: GnoDAOConfig,
) => {
  let source = "";
  if (structure === DaoType.MEMBER_BASED) {
    source = generateMembershipDAOSource(networkId, conf);
  } else {
    source = generateRolesDAOSource(networkId, conf);
  }
  const pkgPath = `gno.land/r/${creator}/${conf.name}`;
  await adenaAddPkg(
    networkId,
    {
      creator,
      deposit: "1ugnot",
      package: {
        name: conf.name,
        path: pkgPath,
        files: [{ name: `${conf.name}.gno`, body: source }],
      },
    },
    { gasWanted: 50000000, gasFee: 5000000 },
  );
  return pkgPath;
};
