// @ts-nocheck
// @ts-nocheck

import { Long, DeepPartial } from "../../../helpers";
import * as _m0 from "protobufjs/minimal";
/** Minter represents the minting state. */
export interface Minter {
  /** current block provisions */
  blockProvisions: string;
}
/** Minter represents the minting state. */
export interface MinterSDKType {
  block_provisions: string;
}
/** required values for team rewards */
export interface TeamVestingMonthInfo {
  monthsSinceGenesis: Long;
  monthStartedBlock: Long;
  oneMonthPeriodInBlocks: Long;
}
/** required values for team rewards */
export interface TeamVestingMonthInfoSDKType {
  months_since_genesis: Long;
  month_started_block: Long;
  one_month_period_in_blocks: Long;
}
export interface MonthlyVestingAddress {
  address: string;
  monthlyAmounts: string[];
}
export interface MonthlyVestingAddressSDKType {
  address: string;
  monthly_amounts: string[];
}
export interface DistributionProportions {
  /**
   * grants_program defines the proportion of the minted minted_denom that is
   * to be allocated as grants.
   */
  grantsProgram: string;
  /**
   * community_pool defines the proportion of the minted minted_denom that is
   * to be allocated to the community pool.
   */
  communityPool: string;
  /**
   * usage_incentive defines the proportion of the minted minted_denom that is
   * to be allocated as usage incentive.
   */
  usageIncentive: string;
  /**
   * staking defines the proportion of the minted minted_denom that is to be
   * allocated as staking rewards.
   */
  staking: string;
  /**
   * developer_rewards defines the proportion of the minted minted_denom that is
   * to be allocated to developer rewards address.
   */
  developerRewards: string;
}
export interface DistributionProportionsSDKType {
  grants_program: string;
  community_pool: string;
  usage_incentive: string;
  staking: string;
  developer_rewards: string;
}
/** Params holds parameters for the mint module. */
export interface Params {
  /** type of coin to mint */
  mintDenom: string;
  /** block provisions from the first block */
  genesisBlockProvisions: string;
  /** number of blocks take to reduce rewards */
  reductionPeriodInBlocks: Long;
  /** reduction multiplier to execute on each period */
  reductionFactor: string;
  /** distribution_proportions defines the proportion of the minted denom */
  distributionProportions: DistributionProportions;
  /** address to receive developer rewards */
  weightedDeveloperRewardsReceivers: MonthlyVestingAddress[];
  /** usage incentive address */
  usageIncentiveAddress: string;
  /** grants program address */
  grantsProgramAddress: string;
  /** team reserve funds address */
  teamReserveAddress: string;
  /** start block to distribute minting rewards */
  mintingRewardsDistributionStartBlock: Long;
}
/** Params holds parameters for the mint module. */
export interface ParamsSDKType {
  mint_denom: string;
  genesis_block_provisions: string;
  reduction_period_in_blocks: Long;
  reduction_factor: string;
  distribution_proportions: DistributionProportionsSDKType;
  weighted_developer_rewards_receivers: MonthlyVestingAddressSDKType[];
  usage_incentive_address: string;
  grants_program_address: string;
  team_reserve_address: string;
  minting_rewards_distribution_start_block: Long;
}
function createBaseMinter(): Minter {
  return {
    blockProvisions: ""
  };
}
export const Minter = {
  encode(message: Minter, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.blockProvisions !== "") {
      writer.uint32(10).string(message.blockProvisions);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Minter {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMinter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.blockProvisions = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Minter>): Minter {
    const message = createBaseMinter();
    message.blockProvisions = object.blockProvisions ?? "";
    return message;
  }
};
function createBaseTeamVestingMonthInfo(): TeamVestingMonthInfo {
  return {
    monthsSinceGenesis: Long.ZERO,
    monthStartedBlock: Long.ZERO,
    oneMonthPeriodInBlocks: Long.ZERO
  };
}
export const TeamVestingMonthInfo = {
  encode(message: TeamVestingMonthInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.monthsSinceGenesis.isZero()) {
      writer.uint32(8).int64(message.monthsSinceGenesis);
    }
    if (!message.monthStartedBlock.isZero()) {
      writer.uint32(16).int64(message.monthStartedBlock);
    }
    if (!message.oneMonthPeriodInBlocks.isZero()) {
      writer.uint32(24).int64(message.oneMonthPeriodInBlocks);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): TeamVestingMonthInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTeamVestingMonthInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.monthsSinceGenesis = (reader.int64() as Long);
          break;
        case 2:
          message.monthStartedBlock = (reader.int64() as Long);
          break;
        case 3:
          message.oneMonthPeriodInBlocks = (reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<TeamVestingMonthInfo>): TeamVestingMonthInfo {
    const message = createBaseTeamVestingMonthInfo();
    message.monthsSinceGenesis = object.monthsSinceGenesis !== undefined && object.monthsSinceGenesis !== null ? Long.fromValue(object.monthsSinceGenesis) : Long.ZERO;
    message.monthStartedBlock = object.monthStartedBlock !== undefined && object.monthStartedBlock !== null ? Long.fromValue(object.monthStartedBlock) : Long.ZERO;
    message.oneMonthPeriodInBlocks = object.oneMonthPeriodInBlocks !== undefined && object.oneMonthPeriodInBlocks !== null ? Long.fromValue(object.oneMonthPeriodInBlocks) : Long.ZERO;
    return message;
  }
};
function createBaseMonthlyVestingAddress(): MonthlyVestingAddress {
  return {
    address: "",
    monthlyAmounts: []
  };
}
export const MonthlyVestingAddress = {
  encode(message: MonthlyVestingAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    for (const v of message.monthlyAmounts) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): MonthlyVestingAddress {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMonthlyVestingAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        case 2:
          message.monthlyAmounts.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<MonthlyVestingAddress>): MonthlyVestingAddress {
    const message = createBaseMonthlyVestingAddress();
    message.address = object.address ?? "";
    message.monthlyAmounts = object.monthlyAmounts?.map(e => e) || [];
    return message;
  }
};
function createBaseDistributionProportions(): DistributionProportions {
  return {
    grantsProgram: "",
    communityPool: "",
    usageIncentive: "",
    staking: "",
    developerRewards: ""
  };
}
export const DistributionProportions = {
  encode(message: DistributionProportions, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.grantsProgram !== "") {
      writer.uint32(10).string(message.grantsProgram);
    }
    if (message.communityPool !== "") {
      writer.uint32(18).string(message.communityPool);
    }
    if (message.usageIncentive !== "") {
      writer.uint32(26).string(message.usageIncentive);
    }
    if (message.staking !== "") {
      writer.uint32(34).string(message.staking);
    }
    if (message.developerRewards !== "") {
      writer.uint32(42).string(message.developerRewards);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): DistributionProportions {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDistributionProportions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.grantsProgram = reader.string();
          break;
        case 2:
          message.communityPool = reader.string();
          break;
        case 3:
          message.usageIncentive = reader.string();
          break;
        case 4:
          message.staking = reader.string();
          break;
        case 5:
          message.developerRewards = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<DistributionProportions>): DistributionProportions {
    const message = createBaseDistributionProportions();
    message.grantsProgram = object.grantsProgram ?? "";
    message.communityPool = object.communityPool ?? "";
    message.usageIncentive = object.usageIncentive ?? "";
    message.staking = object.staking ?? "";
    message.developerRewards = object.developerRewards ?? "";
    return message;
  }
};
function createBaseParams(): Params {
  return {
    mintDenom: "",
    genesisBlockProvisions: "",
    reductionPeriodInBlocks: Long.ZERO,
    reductionFactor: "",
    distributionProportions: DistributionProportions.fromPartial({}),
    weightedDeveloperRewardsReceivers: [],
    usageIncentiveAddress: "",
    grantsProgramAddress: "",
    teamReserveAddress: "",
    mintingRewardsDistributionStartBlock: Long.ZERO
  };
}
export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mintDenom !== "") {
      writer.uint32(10).string(message.mintDenom);
    }
    if (message.genesisBlockProvisions !== "") {
      writer.uint32(18).string(message.genesisBlockProvisions);
    }
    if (!message.reductionPeriodInBlocks.isZero()) {
      writer.uint32(24).int64(message.reductionPeriodInBlocks);
    }
    if (message.reductionFactor !== "") {
      writer.uint32(34).string(message.reductionFactor);
    }
    if (message.distributionProportions !== undefined) {
      DistributionProportions.encode(message.distributionProportions, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.weightedDeveloperRewardsReceivers) {
      MonthlyVestingAddress.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.usageIncentiveAddress !== "") {
      writer.uint32(58).string(message.usageIncentiveAddress);
    }
    if (message.grantsProgramAddress !== "") {
      writer.uint32(66).string(message.grantsProgramAddress);
    }
    if (message.teamReserveAddress !== "") {
      writer.uint32(74).string(message.teamReserveAddress);
    }
    if (!message.mintingRewardsDistributionStartBlock.isZero()) {
      writer.uint32(80).int64(message.mintingRewardsDistributionStartBlock);
    }
    return writer;
  },
  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mintDenom = reader.string();
          break;
        case 2:
          message.genesisBlockProvisions = reader.string();
          break;
        case 3:
          message.reductionPeriodInBlocks = (reader.int64() as Long);
          break;
        case 4:
          message.reductionFactor = reader.string();
          break;
        case 5:
          message.distributionProportions = DistributionProportions.decode(reader, reader.uint32());
          break;
        case 6:
          message.weightedDeveloperRewardsReceivers.push(MonthlyVestingAddress.decode(reader, reader.uint32()));
          break;
        case 7:
          message.usageIncentiveAddress = reader.string();
          break;
        case 8:
          message.grantsProgramAddress = reader.string();
          break;
        case 9:
          message.teamReserveAddress = reader.string();
          break;
        case 10:
          message.mintingRewardsDistributionStartBlock = (reader.int64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<Params>): Params {
    const message = createBaseParams();
    message.mintDenom = object.mintDenom ?? "";
    message.genesisBlockProvisions = object.genesisBlockProvisions ?? "";
    message.reductionPeriodInBlocks = object.reductionPeriodInBlocks !== undefined && object.reductionPeriodInBlocks !== null ? Long.fromValue(object.reductionPeriodInBlocks) : Long.ZERO;
    message.reductionFactor = object.reductionFactor ?? "";
    message.distributionProportions = object.distributionProportions !== undefined && object.distributionProportions !== null ? DistributionProportions.fromPartial(object.distributionProportions) : undefined;
    message.weightedDeveloperRewardsReceivers = object.weightedDeveloperRewardsReceivers?.map(e => MonthlyVestingAddress.fromPartial(e)) || [];
    message.usageIncentiveAddress = object.usageIncentiveAddress ?? "";
    message.grantsProgramAddress = object.grantsProgramAddress ?? "";
    message.teamReserveAddress = object.teamReserveAddress ?? "";
    message.mintingRewardsDistributionStartBlock = object.mintingRewardsDistributionStartBlock !== undefined && object.mintingRewardsDistributionStartBlock !== null ? Long.fromValue(object.mintingRewardsDistributionStartBlock) : Long.ZERO;
    return message;
  }
};
