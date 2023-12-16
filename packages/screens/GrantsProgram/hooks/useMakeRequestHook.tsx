import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import {
  Milestone,
  ShortDescData,
  TeamAndLinkData,
  STATUS_OPEN,
  PRIORITY_HIGH,
} from "../types";

type MakeRequestState = {
  stepIndice: number;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  milestones: Milestone[];
  actions: {
    setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ShortDescData) => void;
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => void;

    addMilestone: (milestone: Milestone) => void;
    removeMilestone: (milestone: Milestone) => void;
  };
};

const TOTAL_STEPS = 5;

export const EMPTY_SHORT_DESC = {
  name: "",
  desc: "",
  budget: "0",
  paymentAddr: "",
  coverImg: "",
  tags: "",
};

export const EMPTY_TEAM_AND_LINK = {
  websiteLink: "",
  twitterProfile: "",
  discordLink: "",
  githubLink: "",
  teamDesc: "",
};

export const EMPTY_MILESTONE = {
  id: -1,
  name: "",
  desc: "",
  statusId: STATUS_OPEN,
  priority: PRIORITY_HIGH,
  budget: 0,
  githubLink: "",
};

export const fakeShortDesc: ShortDescData = {
  name: "This is name",
  desc: "This is long description",
  budget: "123456",
  paymentAddr: "acbderfkjhajskhfjdhsfjkdhsfdsfds",
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

const fakeMilestones: Milestone[] = [
  {
    id: 1,
    name: "Community Docs Platform 1",
    desc: "Milestone description, this is very very very long description of a milestone, we expect this will span on multi lines",
    statusId: STATUS_OPEN,
    priority: PRIORITY_HIGH,
    budget: 10_000_000,
    githubLink: "https://github.com",
  },
];

export const useMakeRequestStore = create<MakeRequestState>((set, get) => ({
  stepIndice: 1,
  shortDescData: fakeShortDesc,
  teamAndLinkData: fakeTeamAndLink,
  milestones: fakeMilestones,
  actions: {
    setStepIndice: (stepIndice: number) => set({ stepIndice }),
    setShortDesc: (shortDescData: ShortDescData) => set({ shortDescData }),
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => {
      set({ teamAndLinkData });
    },
    addMilestone: (milestone: Milestone) => {
      const updatedMilestones = [...get().milestones, milestone].map(
        (t, idx) => {
          t.id = idx;
          return t;
        },
      );

      set({ milestones: updatedMilestones });
    },
    removeMilestone: (milestone: Milestone) => {
      const updatedMilestones = get()
        .milestones.filter((t) => t.id !== milestone.id)
        .map((t, idx) => {
          t.id = idx;
          return t;
        });

      set({ milestones: updatedMilestones });
    },
  },
}));

export const useMakeRequestState = () => {
  const navigation = useAppNavigation();
  const store = useMakeRequestStore();

  const setStep = store.actions.setStepIndice;

  const gotoStep = (stepIndice: number) => {
    store.actions.setStepIndice(stepIndice);
    navigation.navigate("GrantsProgramMakeRequest", { step: stepIndice });
  };

  const goNextStep = () => {
    const nextStep = Math.min(store.stepIndice + 1, TOTAL_STEPS);
    gotoStep(nextStep);
  };

  const goPrevStep = () => {
    const prevStep = Math.max(store.stepIndice - 1, 1);
    gotoStep(prevStep);
  };

  return {
    ...store,
    actions: {
      ...store.actions,
      goNextStep,
      goPrevStep,
      gotoStep,
      setStep,
    },
  };
};
