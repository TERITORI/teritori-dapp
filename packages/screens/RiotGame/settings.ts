export const SQUAD_STAKE_COEF = 0.125; // Duration (in hours) = 0.125 * stamin
export const DURATION_TO_XP_COEF = 100; // XP = 100 * duration (in hours)

export const THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_SQUAD_STAKING_CONTRACT_ADDRESS || "";

export const THE_RIOT_COLLECTION_ADDRESS =
  process.env.THE_RIOT_COLLECTION_ADDRESS || "";

export const THE_RIOT_COLLECTION_ID = `tori-${THE_RIOT_COLLECTION_ADDRESS}`;

export const THE_RIOT_BREEDING_CONTRACT_ADDRESS =
  process.env.THE_RIOT_BREEDING_CONTRACT_ADDRESS || "";

export const TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS =
  process.env.TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS || "";

export const PRIZE_POOL: { [key: string]: number } = {
  "2022-12": 1_800_000,
  "2023-01": 1_710_000,
  "2023-02": 1_620_000,
  "2023-03": 1_170_000,
  "2023-04": 720_000,
  "2023-05": 630_000,
  "2023-06": 540_000,
  "2023-07": 450_000,
  "2023-08": 360_000,
};
