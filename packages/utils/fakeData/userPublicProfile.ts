import avatarPNG from "../../../assets/default-images/avatar.png";
import guardianPNG from "../../../assets/default-images/guardian_1.png";
import bidsSVG from "../../../assets/icons/activity-types/bids.svg";
import burnsSVG from "../../../assets/icons/activity-types/burns.svg";
import followingsSVG from "../../../assets/icons/activity-types/followings.svg";
import likesSVG from "../../../assets/icons/activity-types/likes.svg";
import listingSVG from "../../../assets/icons/activity-types/listing.svg";
import purchaseSVG from "../../../assets/icons/activity-types/purchase.svg";
import salesSVG from "../../../assets/icons/activity-types/sales.svg";
import transferSVG from "../../../assets/icons/activity-types/transfer.svg";
import { Activity } from "../../components/cards/ActivityCard";
import { Quest } from "../../components/cards/QuestCard";

export const fakeQuests: Quest[] = [
  { label: "Claim Teritori    Airdrop", isSucceed: true },
  { label: "Book a Handle Teritori Name Service", isSucceed: true },
  { label: "Buy your 1st NFT on Launchpad", isSucceed: true },
  { label: "List your 1st  NFT on Marketplace", isSucceed: true },
  { label: "Sell your 1st NFT on Marketplace ", isSucceed: true },
  { label: "Put your Graffiti on Rioters Footer", isSucceed: true },
  { label: "Put your Graffiti on Rioters Footer", isSucceed: true },
  { label: "Put your Graffiti on Rioters Footer", isSucceed: true },
  { label: "List your 1st  NFT on Marketplace", isSucceed: true },
  { label: "Book a Handle Teritori Name Service", isSucceed: true },
  { label: "Buy your 1st NFT on Launchpad", isSucceed: true },
  { label: "Sell your 1st NFT on Marketplace ", isSucceed: true },
  { label: "Put your Graffiti on Rioters Footer", isSucceed: true },
];

export const fakeActivities: Activity[] = [
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Listing", iconSVG: listingSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Purchase", iconSVG: purchaseSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Sales", iconSVG: salesSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Transfer", iconSVG: transferSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Burns", iconSVG: burnsSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Likes", iconSVG: likesSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Bids", iconSVG: bidsSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
  {
    label: "Guardian Genesis #0",
    image: guardianPNG,
    date: "2022-03-10T16:37:00",
    type: { label: "Followings", iconSVG: followingsSVG },
    userFromAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userFromImage: avatarPNG,
    userToAddress: "tori1ch8e2j5vdhtg4af7pr02g6ux6vnftr5nj5n7ad",
    userToImage: avatarPNG,
  },
];
