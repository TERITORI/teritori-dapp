import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { create } from "zustand";

import {
  CreateTokenState,
  emptyCreateTokenFormBasics,
  emptyCreateTokenFormDetails,
} from "../utils/forms";

import { useAppNavigation } from "@/utils/navigation";

const TOTAL_STEPS = 3;

const useCreateTokenStore = create<CreateTokenState>((set) => ({
  stepIndice: 1,
  createTokenFormBasics: emptyCreateTokenFormBasics,
  createTokenFormDetails: emptyCreateTokenFormDetails,
  actions: {
    setBasics: (basics) => set({ createTokenFormBasics: basics }),
    setDetails: (details) => set({ createTokenFormDetails: details }),
  },
}));

export const useCreateTokenState = () => {
  const navigation = useAppNavigation();
  const store = useCreateTokenStore();
  const route = useRoute();
  const step = !route.params ? 1 : (route.params as any).step;

  const stepIndex = useMemo(() => {
    try {
      let res = step ? parseInt(step, 10) : 1;
      res = Number.isInteger(res) ? res : 1;
      res = res > 5 || res < 0 ? 1 : res;
      return res;
    } catch {
      return 1;
    }
  }, [step]);

  const gotoStep = (stepIndex: number) => {
    navigation.navigate("LaunchpadERC20CreateToken", { step: stepIndex });
  };

  const goNextStep = () => {
    const nextStep = Math.min(stepIndex + 1, TOTAL_STEPS);
    gotoStep(nextStep);
  };

  const goPrevStep = () => {
    const prevStep = Math.max(stepIndex - 1, 1);
    gotoStep(prevStep);
  };

  return {
    ...store,
    stepIndice: stepIndex,
    actions: {
      ...store.actions,
      goNextStep,
      goPrevStep,
      gotoStep,
    },
  };
};
