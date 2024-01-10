import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import {
  MilestoneFormData,
  MsPriority,
  MsStatus,
  ShortDescData,
  TeamAndLinkData,
} from "../types";

type MakeRequestState = {
  stepIndice: number;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  milestones: MilestoneFormData[];
  actions: {
    setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ShortDescData) => void;
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => void;

    addMilestone: (milestone: MilestoneFormData) => void;
    removeMilestone: (milestone: MilestoneFormData) => void;
  };
};

const TOTAL_STEPS = 5;

export const EMPTY_SHORT_DESC: ShortDescData = {
  name: "",
  desc: "",
  funder: "",
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
  status: MsStatus.MS_OPEN,
  priority: MsPriority.MS_PRIORITY_MEDIUM,
  budget: 0,
  githubLink: "",
};

export const fakeShortDesc: ShortDescData = {
  name: "This is name",
  desc: "This is long description",
  budget: "123456",
  funder: "",
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

const fakeMilestones: MilestoneFormData[] = [
  {
    id: 1,
    name: "Community Docs Platform 1",
    desc: "Milestone description, this is very very very long description of a milestone, we expect this will span on multi lines",
    status: MsStatus.MS_OPEN,
    priority: MsPriority.MS_PRIORITY_HIGH,
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
    addMilestone: (milestone: MilestoneFormData) => {
      const updatedMilestones = [...get().milestones, milestone].map(
        (t, idx) => {
          t.id = idx;
          return t;
        },
      );

      set({ milestones: updatedMilestones });
    },
    removeMilestone: (milestone: MilestoneFormData) => {
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
    navigation.navigate("ProjectsMakeRequest", { step: stepIndice });
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
