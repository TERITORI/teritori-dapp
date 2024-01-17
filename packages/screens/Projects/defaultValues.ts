import { ShortDescData, TeamAndLinkData } from "./types";

export const emptyTeamAndLink: TeamAndLinkData = {
  websiteLink: "",
  twitterProfile: "",
  discordLink: "",
  githubLink: "",
  teamDesc: "",
};

export const emptyShortDesc: ShortDescData = {
  name: "",
  desc: "",
  budget: 0,
  duration: 0,
  paymentAddr: "",
  coverImg: "",
  tags: "",
  funder: "",
  contractor: "",
  _coverImgFile: undefined,
};

export const fakeShortDesc: ShortDescData = {
  name: "This is name",
  desc: "This is long description",
  budget: 0,
  duration: 0,
  funder: "",
  contractor: "",
  paymentAddr: "gno.land/r/demo/foo20",
  coverImg: "https://thisis.img",
  tags: "tag1,tag2,tag3",
};

export const fakeTeamAndLink: TeamAndLinkData = {
  websiteLink: "https://website.com",
  twitterProfile: "https://twitter.com",
  discordLink: "https://discord.com",
  githubLink: "https://github.com",
  teamDesc: "This is long team description",
};

