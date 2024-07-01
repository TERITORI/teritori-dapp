import {
  ProjectFormData,
  ProjectTeamAndLinkFormData,
} from "./hooks/useMakeRequestHook";

export const emptyTeamAndLink: ProjectTeamAndLinkFormData = {
  websiteLink: "",
  twitterProfile: "",
  discordLink: "",
  githubLink: "",
  teamDesc: "",
};

export const emptyProjectFormData: ProjectFormData = {
  name: "",
  desc: "",
  arbitrator: "",
  coverImg: {},
};

// Used only when dev, for quickly goto next step
/*
export const fakeShortDesc: ShortDescData = {
  name: "This is name",
  desc: "This is long description",
  arbitrator: "",
  budget: 0,
  duration: 0,
  funder: "",
  contractor: "",
  coverImg: "https://thisis.img",
  tags: "tag1,tag2,tag3",
};
*/
export const fakeTeamAndLink: ProjectTeamAndLinkFormData = {
  websiteLink: "https://website.com",
  twitterProfile: "https://twitter.com",
  discordLink: "https://discord.com",
  githubLink: "https://github.com",
  teamDesc: "This is long team description",
};
/*
export const fakeMilestones: ProjectMilestone[] = [
  {
    id: 1,
    title: "Community Docs Platform 1",
    desc: "Milestone description this is very very very long description of a milestone we expect this will span on multi lines",
    status: MsStatus.MS_OPEN,
    priority: MsPriority.MS_PRIORITY_HIGH,
    amount: 10,
    link: "https://github.com",
    funded: false,
    paid: 0,
    duration: 60 * 60 * 24 * 7,
  },
];
*/
