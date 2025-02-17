import { z } from "zod";

import { CollectionProject } from "@/contracts-clients/nft-launchpad";
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
      (value) => !value || NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    )
    .optional(),
  denom: z.string().trim(),
});

export type Coin = z.infer<typeof ZodCoin>;

// ===== Shapes to build front objects
const ZodCollectionMintPeriodFormValues = z.object({
  price: ZodCoin,
  maxTokens: z
    .string()
    .trim()
    .refine(
      (value) => !value || NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    )
    .optional(),
  perAddressLimit: z
    .string()
    .trim()
    .refine(
      (value) => !value || NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    )
    .optional(),
  startTime: z.number().min(1, DEFAULT_FORM_ERRORS.required),
  endTime: z.number().optional(),
  whitelistAddressesFile: ZodLocalFileData.optional(),
  whitelistAddresses: z.array(z.string()).optional(),
  isOpen: z.boolean(),
});

export const ZodCollectionAssetsAttributeFormValues = z.object({
  value: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  type: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
});

export const ZodCollectionAssetsMetadataFormValues = z.object({
  image: ZodLocalFileData,
  externalUrl: z
    .string()
    .trim()
    // We ignore the URL format control since externalUrl is optional
    // .refine(
    //   (value) => !value || URL_REGEX.test(value),
    //   DEFAULT_FORM_ERRORS.onlyUrl,
    // )
    .optional(),
  description: z.string().trim().optional(),
  name: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  youtubeUrl: z.string().trim().optional(),
  attributes: z.array(ZodCollectionAssetsAttributeFormValues),
});

export const ZodCollectionAssetsMetadatasFormValues = z.object({
  assetsMetadatas: z.array(ZodCollectionAssetsMetadataFormValues).optional(),
  nftApiKey: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
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
  websiteLink: z
    .string()
    .trim()
    .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl)
    .optional(),
  email: z
    .string()
    .trim()
    .refine((value) => EMAIL_REGEXP.test(value), DEFAULT_FORM_ERRORS.onlyEmail)
    .optional(),
  projectTypes: z.array(z.string().trim()).min(1, DEFAULT_FORM_ERRORS.required),
  revealTime: z.number().optional(),
  teamDescription: z.string().trim().optional(),
  partnersDescription: z.string().trim().optional(),
  investDescription: z.string().trim().optional(),
  investLink: z.string().trim().optional(),
  artworkDescription: z.string().trim().optional(),
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
  royaltyPercentage: z
    .string()
    .trim()
    .refine(
      (value) => !value || NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    )
    .optional(),
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

export type CollectionAssetsAttributeFormValues = z.infer<
  typeof ZodCollectionAssetsAttributeFormValues
>;

export type CollectionMintPeriodFormValues = z.infer<
  typeof ZodCollectionMintPeriodFormValues
>;

export type CollectionAssetsMetadataFormValues = z.infer<
  typeof ZodCollectionAssetsMetadataFormValues
>;

export type CollectionAssetsMetadatasFormValues = z.infer<
  typeof ZodCollectionAssetsMetadatasFormValues
>;

// ===== Shapes to build objects received from API
const ZodCoinDataResult = z.object({
  amount: z.string(),
  denom: z.string(),
});

const ZodWhitelistInfoDataResult = z.object({
  addresses_count: z.number(),
  addresses_ipfs: z.string(),
  addresses_merkle_root: z.string(),
});

const ZodMintPeriodDataResult = z.object({
  end_time: z.number().nullish(),
  limit_per_address: z.number().nullish(),
  max_tokens: z.number().nullish(),
  price: ZodCoinDataResult.nullish(),
  start_time: z.number(),
  whitelist_info: ZodWhitelistInfoDataResult.nullish(),
});

export const ZodCollectionDataResult = z.object({
  artwork_desc: z.string(),
  base_token_uri: z.string().nullish(), // TODO REMOVE
  contact_email: z.string(),
  cover_img_uri: z.string(),
  dao_whitelist_count: z.number(),
  deployed_address: z.string().nullish(),
  desc: z.string(),
  escrow_mint_proceeds_period: z.number(),
  investment_desc: z.string(),
  investment_link: z.string(),
  is_applied_previously: z.boolean(),
  is_dox: z.boolean(),
  is_project_derivative: z.boolean(),
  is_ready_for_mint: z.boolean(),
  metadatas_merkle_root: z.string().nullish(),
  mint_periods: z.array(ZodMintPeriodDataResult),
  name: z.string(),
  partners: z.string(),
  project_type: z.string(),
  reveal_time: z.number().nullish(),
  royalty_address: z.string().nullish(),
  royalty_percentage: z.number().nullish(),
  symbol: z.string(),
  target_network: z.string(),
  team_desc: z.string(),
  tokens_count: z.number(),
  website_link: z.string(),
});

export type MintPeriodDataResult = z.infer<typeof ZodMintPeriodDataResult>;

export type CollectionDataResult = z.infer<typeof ZodCollectionDataResult>;

// ===== Shapes to build objects to sent to API
export type CollectionToSubmit = Omit<
  CollectionProject,
  "deployed_address" | "base_token_uri" | "owner"
>;

// ===== Shapes to build objects received from API
// ...Coming soon
