import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { z } from "zod";
import { create } from "zustand";

import { useAppNavigation } from "@/utils/navigation";

export const zodCreateSaleForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().optional(), // depends on private or public sale
  startTimestamp: z.number().int().min(1), // replace by date parsing w/ a date picker component
  endTimestamp: z.number().int().min(1), // replace by date parsing w/ a date picker component
  pricePerToken: z.number().int().min(1),
  limitPerAddr: z.number().int().min(1),
  minGoal: z.number().int().min(1),
  maxGoal: z.number().int().min(1),
  minted: z.boolean(),
});

export type CreateSaleForm = z.infer<typeof zodCreateSaleForm>;

export const emptyCreateSaleForm: CreateSaleForm = {
  caller: "",
  tokenName: "",
  merkleRoot: "",
  startTimestamp: 0,
  endTimestamp: 0,
  pricePerToken: 0,
  limitPerAddr: 0,
  minGoal: 0,
  maxGoal: 0,
  minted: false,
};

type CreateSaleState = {
  stepIndice: number;
  createSaleForm: CreateSaleForm;
  actions: {
    setSale: (sale: CreateSaleForm) => void;
  };
};

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
