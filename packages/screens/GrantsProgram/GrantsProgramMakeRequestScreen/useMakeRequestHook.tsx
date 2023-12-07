import { create } from "zustand";

import { ShortDescData, TeamAndLinkData } from "./types";
import { useAppNavigation } from "../../../utils/navigation";

type MakeRequestState = {
  stepIndice: number;
  shortDescData: ShortDescData | undefined;
  teamAndLinkData: TeamAndLinkData | undefined;
  actions: {
    setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ShortDescData) => void;
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) => void;
  };
};

const TOTAL_STEPS = 5;

export const useMakeRequestStore = create<MakeRequestState>((set, get) => ({
  stepIndice: 1,
  shortDescData: undefined,
  teamAndLinkData: undefined,
  actions: {
    setStepIndice: (stepIndice: number) => set({ stepIndice }),
    setShortDesc: (shortDescData: ShortDescData) => set({ shortDescData }),
    setTeamAndLink: (teamAndLinkData: TeamAndLinkData) =>
      set({ teamAndLinkData }),
  },
}));

export const useMakeRequestState = () => {
  const navigation = useAppNavigation();
  const store = useMakeRequestStore();

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
    },
  };
};
