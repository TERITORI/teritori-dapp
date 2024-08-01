import {
  ProjectFormData,
  ProjectTeamAndLinkFormData,
} from "./hooks/useMakeRequestHook";

/*
const emptyTeamAndLink: ProjectTeamAndLinkFormData = {
  websiteLink: "",
  twitterProfile: "",
  discordLink: "",
  githubLink: "",
  teamDesc: "",
};
*/

export const emptyProjectFormData: ProjectFormData = {
  creatorAddress: "",
  name: "",
  description: "",
  arbitratorAddress: "",
  coverImg: "",
  creatorKind: "contractor",
  tags: "",
};

export const fakeTeamAndLink: ProjectTeamAndLinkFormData = {
  websiteLink: "https://website.com",
  twitterProfile: "https://twitter.com",
  discordLink: "https://discord.com",
  githubLink: "https://github.com",
  teamDesc: "This is long team description",
};
