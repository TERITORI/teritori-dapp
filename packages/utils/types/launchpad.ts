import { z } from "zod";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import { isIpfsPathValid } from "@/utils/ipfs";
import {
  EMAIL_REGEXP,
  LETTERS_REGEXP,
  NUMBERS_REGEXP,
  URL_REGEX,
} from "@/utils/regex";
import { ZodLocalFileData } from "@/utils/types/files";

const ZodCoin = z.object({
  amount: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  denom: z.string().trim(),
});

export type Coin = z.infer<typeof ZodCoin>;

// ===== Shapes to build front objects
const ZodCollectionMintPeriodFormValues = z.object({
  price: ZodCoin,
  maxTokens: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  perAddressLimit: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  startTime: z.number().min(1, DEFAULT_FORM_ERRORS.required),
  endTime: z.number().min(1, DEFAULT_FORM_ERRORS.required),
  whitelistAddressesFile: ZodLocalFileData.optional(),
  whitelistAddresses: z.array(z.string()).optional(),
  isOpen: z.boolean(),
});

export const ZodCollectionAssetsMetadataFormValues = z.object({
  image: ZodLocalFileData,
  externalUrl: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  description: z.string().trim().optional(),
  name: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  youtubeUrl: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  attributes: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
});

export const ZodCollectionAssetsMetadatasFormValues = z.object({
  assetsMetadatas: z.array(ZodCollectionAssetsMetadataFormValues).optional(),
});

export const ZodCollectionFormValues = z.object({
  name: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  description: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  symbol: z
    .string()
    .trim()
    .toUpperCase()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => LETTERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyLetters,
    ),
  // externalLink: z
  //   .string()
  //   .trim()
  //   .refine(
  //     (value) => !value || URL_REGEX.test(value),
  //     DEFAULT_FORM_ERRORS.onlyUrl,
  //   )
  //   .optional(),
  websiteLink: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  // twitterProfileUrl: z
  //   .string()
  //   .trim()
  //   .min(1, DEFAULT_FORM_ERRORS.required)
  //   .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl),
  // nbTwitterFollowers: z
  //   .string()
  //   .trim()
  //   .min(1, DEFAULT_FORM_ERRORS.required)
  //   .refine(
  //     (value) => NUMBERS_REGEXP.test(value),
  //     DEFAULT_FORM_ERRORS.onlyNumbers,
  //   ),
  // discordName: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  email: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => EMAIL_REGEXP.test(value), DEFAULT_FORM_ERRORS.onlyEmail),
  projectTypes: z.array(z.string().trim()).min(1, DEFAULT_FORM_ERRORS.required),
  projectDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  tokensCount: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  revealTime: z.number().min(1, DEFAULT_FORM_ERRORS.required),
  teamDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  // teamLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  partnersDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  // roadmapLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  artworkDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  expectedSupply: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  expectedPublicMintPrice: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  expectedMintDate: z.number().min(1, DEFAULT_FORM_ERRORS.required),
  coverImage: ZodLocalFileData,
  isPreviouslyApplied: z.boolean(),
  isDerivativeProject: z.boolean(),
  isReadyForMint: z.boolean(),
  isDox: z.boolean(),
  escrowMintProceedsPeriod: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required),
  daoWhitelistCount: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  mintPeriods: z.array(ZodCollectionMintPeriodFormValues).nonempty(),
  royaltyAddress: z.string().trim().optional(),
  royaltyPercentage: z.string().trim().optional(),
  assetsMetadatas: ZodCollectionAssetsMetadatasFormValues.optional(),
  baseTokenUri: z
    .string()
    .trim()
    .refine(
      (value) => !value || isIpfsPathValid(value),
      DEFAULT_FORM_ERRORS.onlyIpfsUri,
    )
    .optional(),
  coverImageUri: z
    .string()
    .trim()
    .refine(
      (value) => !value || isIpfsPathValid(value),
      DEFAULT_FORM_ERRORS.onlyIpfsUri,
    )
    .optional(),
});

export type CollectionFormValues = z.infer<typeof ZodCollectionFormValues>;

export type CollectionMintPeriodFormValues = z.infer<
  typeof ZodCollectionMintPeriodFormValues
>;

export type CollectionAssetsMetadataFormValues = z.infer<
  typeof ZodCollectionAssetsMetadataFormValues
>;

export type CollectionAssetsMetadatasFormValues = z.infer<
  typeof ZodCollectionAssetsMetadatasFormValues
>;

// ===== Shapes to build objects from api
const ZodWhitelistInfoDataResult = z.object({
  addresses_count: z.number(),
  addresses_ipfs: z.string(),
  addresses_merkle_root: z.string(),
});

const ZodMintPeriodDataResult = z.object({
  end_time: z.number().optional(),
  limit_per_address: z.number().optional(),
  max_tokens: z.number().optional(),
  price: ZodCoin.optional(),
  start_time: z.number(),
  whitelist_info: ZodWhitelistInfoDataResult.optional(),
});

export const ZodCollectionDataResult = z.object({
  artwork_desc: z.string(),
  base_token_uri: z.string().optional(),
  // contact_discord_name: z.string(),
  contact_email: z.string(),
  cover_img_uri: z.string(),
  dao_whitelist_count: z.number(),
  deployed_address: z.string().optional(),
  desc: z.string(),
  escrow_mint_proceeds_period: z.number(),
  expected_mint_date: z.number(),
  expected_public_mint_price: z.number(),
  expected_supply: z.number(),
  // external_link: z.string().optional(),
  investment_desc: z.string(),
  investment_link: z.string(),
  is_applied_previously: z.boolean(),
  is_dox: z.boolean(),
  is_project_derivative: z.boolean(),
  is_ready_for_mint: z.boolean(),
  metadatas_merkle_root: z.string().optional(),
  mint_periods: z.array(ZodMintPeriodDataResult),
  name: z.string(),
  partners: z.string(),
  project_desc: z.string(),
  project_type: z.string(),
  reveal_time: z.number().optional(),
  // roadmap_link: z.string(),
  royalty_address: z.string().optional(),
  royalty_percentage: z.number().optional(),
  symbol: z.string(),
  target_network: z.string(),
  team_desc: z.string(),
  // team_link: z.string(),
  tokens_count: z.number(),
  // twitter_followers_count: z.number(),
  // twitter_profile: z.string(),
  website_link: z.string().optional(),
  // whitepaper_link: z.string(),
});

export type CollectionDataResult = z.infer<typeof ZodCollectionDataResult>;
