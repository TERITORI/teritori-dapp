import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import {
  fakeMilestones,
  fakeShortDesc,
  fakeTeamAndLink,
} from "../defaultValues";
import { ProjectMilestone, ShortDescData, TeamAndLinkData } from "../types";

// TEST DATA

type MakeRequestState = {
  stepIndice: number;
  shortDescData: ShortDescData;
  teamAndLinkData: TeamAndLinkData;
  milestones: ProjectMilestone[];
  actions: {
    // setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ShortDescData) => void;
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => void;

    addMilestone: (milestone: ProjectMilestone) => void;
    removeMilestone: (milestone: ProjectMilestone) => void;
  };
};

const TOTAL_STEPS = 5;

const useMakeRequestStore = create<MakeRequestState>((set, get) => ({
  stepIndice: 1,
  shortDescData: fakeShortDesc,
  teamAndLinkData: fakeTeamAndLink,
  milestones: fakeMilestones,
  actions: {
    // setStepIndice: (stepIndice: number) => set({ stepIndice }),
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
  const route = useRoute();
  const step = !route.params ? 1 : (route.params as any).step;

  const { data: stepIndice } = useQuery(
    ["stepIndice", step],
    async () => {
      let res = step ? parseInt(step, 10) : 1;
      res = Number.isInteger(res) ? res : 1;
      res = res > 5 || res < 0 ? 1 : res;
      return res;
    },
    { initialData: 1 },
  );

  // const setStep = store.actions.setStepIndice;

  const gotoStep = (stepIndice: number) => {
    // store.actions.setStepIndice(stepIndice);
    navigation.navigate("ProjectsMakeRequest", { step: stepIndice });
  };

  const goNextStep = () => {
    const nextStep = Math.min(stepIndice + 1, TOTAL_STEPS);
    gotoStep(nextStep);
  };

  const goPrevStep = () => {
    const prevStep = Math.max(stepIndice - 1, 1);
    gotoStep(prevStep);
  };

  return {
    ...store,
    stepIndice,
    actions: {
      ...store.actions,
      goNextStep,
      goPrevStep,
      gotoStep,
      // setStep,
    },
  };
};
