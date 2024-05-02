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

export const ZodCoin = z.object({
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

export const ZodCollectionMintPeriodFormValues = z.object({
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
  externalLink: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  websiteLink: z
    .string()
    .trim()
    .refine(
      (value) => !value || URL_REGEX.test(value),
      DEFAULT_FORM_ERRORS.onlyUrl,
    )
    .optional(),
  twitterProfileUrl: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine((value) => URL_REGEX.test(value), DEFAULT_FORM_ERRORS.onlyUrl),
  nbTwitterFollowers: z
    .string()
    .trim()
    .min(1, DEFAULT_FORM_ERRORS.required)
    .refine(
      (value) => NUMBERS_REGEXP.test(value),
      DEFAULT_FORM_ERRORS.onlyNumbers,
    ),
  discordName: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
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
  teamLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  partnersDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investDescription: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  investLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
  roadmapLink: z.string().trim().min(1, DEFAULT_FORM_ERRORS.required),
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
  assetsMetadatas: z.array(ZodCollectionAssetsMetadataFormValues).optional(),
  baseTokenUri: z
    .string()
    .trim()
    .refine(
      (value) => !value || isIpfsPathValid(value),
      DEFAULT_FORM_ERRORS.onlyIpfsUri,
    )
    .optional()
    .optional(),
  coverImageUri: z
    .string()
    .trim()
    .refine(
      (value) => !value || isIpfsPathValid(value),
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
