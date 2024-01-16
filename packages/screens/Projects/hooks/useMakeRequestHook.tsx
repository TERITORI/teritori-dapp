import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import {
  ProjectMilestone,
  MsPriority,
  MsStatus,
  ShortDescData,
  TeamAndLinkData,
} from "../types";

type MakeRequestState = {
  stepIndice: number;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  milestones: ProjectMilestone[];
  actions: {
    setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ShortDescData) => void;
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => void;

    addMilestone: (milestone: ProjectMilestone) => void;
    removeMilestone: (milestone: ProjectMilestone) => void;
  };
};

const TOTAL_STEPS = 5;

export const EMPTY_SHORT_DESC: ShortDescData = {
  name: "",
  desc: "",
  funder: "",
  contractor: "",
  budget: 0,
  duration: 0,
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

const fakeMilestones: ProjectMilestone[] = [
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
    addMilestone: (milestone: ProjectMilestone) => {
      const updatedMilestones = [...get().milestones, milestone].map(
        (t, idx) => {
          t.id = idx;
          return t;
        },
      );

      set({ milestones: updatedMilestones });
    },
    removeMilestone: (milestone: ProjectMilestone) => {
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
