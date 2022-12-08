export const SQUAD_STAKE_COEF = 0.125; // Duration (in hours) = 0.125 * stamin
export const DURATION_TO_XP_COEF = 100; // XP = 100 * duration (in hours)

export const THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS || "";

export const THE_RIOT_COLLECTION_ADDRESS =
  process.env.THE_RIOT_COLLECTION_ADDRESS || "";

export const THE_RIOT_COLLECTION_ID = `tori-${THE_RIOT_COLLECTION_ADDRESS}`;

export const THE_RIOT_BREEDING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS || "";
