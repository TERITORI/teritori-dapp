import { z } from "zod";

import { DEFAULT_FORM_ERRORS } from "@/utils/errors";
import {
  EMAIL_REGEXP,
  IPFS_URI_REGEX,
  NUMBERS_REGEXP,
  URL_REGEX,
} from "@/utils/regex";
import { ZodLocalFileData } from "@/utils/types/files";

export const ZodCoin = z.object({
  amount: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  denom: z.string(),
});

export const ZodCollectionMintPeriodFormValues = z.object({
  price: ZodCoin,
  maxTokens: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  perAddressLimit: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  startTime: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  endTime: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  whitelistAddressesFile: ZodLocalFileData.optional(),
  whitelistAddresses: z.array(z.string()).optional(),
  isOpen: z.boolean(),
});

export const ZodCollectionAssetsMetadataFormValues = z.object({
  image: ZodLocalFileData,
  externalUrl: z
    .string()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  description: z.string().optional(),
  name: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  youtubeUrl: z
    .string()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  attributes: z.string().min(1, DEFAULT_FORM_ERRORS.required),
});

export const ZodCollectionFormValues = z.object({
  name: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  description: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  symbol: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  externalLink: z
    .string()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  websiteLink: z
    .string()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  twitterProfileUrl: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl),
  nbTwitterFollowers: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  discordName: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  email: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => EMAIL_REGEXP.test(value), DEFAULT_FORM_ERRORS.onlyEmail),
  projectTypes: z.array(z.string()).min(1, DEFAULT_FORM_ERRORS.required),
  projectDescription: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  tokensCount: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  revealTime: z.string().optional(),
  teamDescription: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  teamLink: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl),
  partnersDescription: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  investDescription: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  investLink: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  roadmapLink: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  artworkDescription: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  expectedSupply: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  expectedPublicMintPrice: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  expectedMintDate: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  coverImage: ZodLocalFileData,
  isPreviouslyApplied: z.boolean(),
  isDerivativeProject: z.boolean(),
  isReadyForMint: z.boolean(),
  isDox: z.boolean(),
  escrowMintProceedsPeriod: z.string().min(1, DEFAULT_FORM_ERRORS.required),
  daoWhitelistCount: z
    .string()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  mintPeriods: z.array(ZodCollectionMintPeriodFormValues).nonempty(),
  royaltyAddress: z.string().optional(),
  royaltyPercentage: z.string().optional(),
  assetsMetadatas: z.array(ZodCollectionAssetsMetadataFormValues).optional(),
  baseTokenUri: z
    .string()
    .refine(
      (value) => !value || IPFS_URI_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyIpfsUri,
    )
    .optional()
    .optional(),
  coverImageUri: z
    .string()
    .refine(
      (value) => !value || IPFS_URI_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyIpfsUri,
    )
    .optional()
    .optional(),
});

export type CollectionFormValues = z.infer<typeof ZodCollectionFormValues>;

export type CollectionMintPeriodFormValues = z.infer<
  typeof ZodCollectionMintPeriodFormValues
>;

export type CollectionAssetsMetadataFormValues = z.infer<
  typeof ZodCollectionAssetsMetadataFormValues
>;

export type Coin = z.infer<typeof ZodCoin>;
