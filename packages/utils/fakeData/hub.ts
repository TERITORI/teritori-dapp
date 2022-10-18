import defaultGraphPNG from "../../../assets/default-images/default-graph-nft.png";
import defaultGuardianPNG from "../../../assets/default-images/default-guardian-nft.png";
import defaultToripunkPNG from "../../../assets/default-images/default-toripunk-nft.png";
import { News } from "../../components/hub/NewsBox";

export const fakeNews: News[] = [
  {
    title: "JOIN THE R!OT \n Discover the first NFT project on Teritori",
    text:
      "The R!ot is the first NFT project on Teritori Network. This collection tells the story of the members of The R!ot battling The Legion Club through a complete lore and P2E mechanics. \n" +
      "\n" +
      "In addition to this, this collection is closely linked to the Teritori Hub and grants its holders the possibility to access Teritori features in early access.",
    image: defaultGuardianPNG,
    button1Label: "Join the Mint",
    button2Label: "Discover more",
    button1Action: () => {},
    button2Action: () => {},
  },
  {
    title: "BOOK YOUR HANDLE\n" + "Check out Teritori Name Service",
    text:
      "Teritori Name Service is a way for you to affirm your identity as a Teritorian. TNS are NFTs that can be used throughout the Teritori dApp and of course you can also sell them on the Marketplace.\n" +
      "\n" +
      "More Name Services will be added to TNS over time so stay on the lookout for the next updates.",
    image: defaultGuardianPNG,
    button1Label: "Teritori Name Service",
    button1Action: () => {},
  },
  {
    title: "NEW PLANET, NEW RULES, NEW WAYS\n" + "Introducing the ToriPunks",
    text:
      "The ToriPunks are invading Teritori and the least we can say is that they did not come empty-handed.\n" +
      "\n" +
      "If you like to play games & earn rewards, you’re at the right place. Mint is coming soon on the launchpad.",
    image: defaultToripunkPNG,
    button1Label: "Launchpad",
    button2Label: "Learn more",
    button1Action: () => {},
    button2Action: () => {},
  },
  {
    title:
      "LEAVE YOUR MARK ON THE DAPP\n" +
      "Participate in the rioters’ footer Graff Contest",
    text:
      "We're hosting a contest for you to design your own graff/artwork so we can create a special community  NFT collection with your creations.\n" +
      "\n" +
      "The contest will last until the collection is complete.\n" +
      "\n" +
      "Players whose creation is selected will earn:\n" +
      "- An XP bonus for Game of Teritori Season 2.\n" +
      "- Earn freemints on this community NFT collection.",
    image: defaultGraphPNG,
    button1Label: "Submit your artwork",
    button1Action: () => {},
  },
];
