import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import { emptyShortDesc, emptyTeamAndLink } from "../defaultValues";
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

const useMakeRequestStore = create<MakeRequestState>((set, get) => ({
  stepIndice: 1,
  shortDescData: emptyShortDesc,
  teamAndLinkData: emptyTeamAndLink,
  milestones: [],
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
