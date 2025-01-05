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
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl),
  email: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => EMAIL_REGEXP.test(value), DEFAULT_FORM_ERRORS.onlyEmail),
  projectTypes: z.array(z.string().trim()).min(1, DEFAULT_FORM_ERRORS.required),
  revealTime: z.number().optional(),
  teamDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  partnersDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  artworkDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
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

// ===== Shapes to build objects to sent to API
export type CollectionToSubmit = Omit<
  CollectionProject,
  "deployed_address" | "base_token_uri" | "owner"
>;

// ===== Shapes to build objects received from API
// ...Coming soon
