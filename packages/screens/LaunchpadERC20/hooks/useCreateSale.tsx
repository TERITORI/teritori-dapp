import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { create } from "zustand";

import { CreateSaleState, emptyCreateSaleForm } from "../utils/forms";

import { useAppNavigation } from "@/utils/navigation";

const TOTAL_STEPS = 2;

const useCreateSaleStore = create<CreateSaleState>((set) => ({
  stepIndice: 1,
  createSaleForm: emptyCreateSaleForm,
  actions: {
    setSale: (sale) => set({ createSaleForm: sale }),
  },
}));

export const useCreateSaleState = () => {
  const navigation = useAppNavigation();
  const store = useCreateSaleStore();
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
    navigation.navigate("LaunchpadERC20CreateSale", { step: stepIndex });
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
