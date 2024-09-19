import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { z } from "zod";
import { create } from "zustand";

import { useAppNavigation } from "@/utils/navigation";

export const zodCreateTokenFormBasics = z.object({
  caller: z.string().min(3),
  name: z.string().min(3),
  symbol: z.string().min(3),
  decimals: z.number().int().min(0).max(18),
  totalSupply: z.string().min(1),
  totalSupplyCap: z.string().min(1),
});

export type CreateTokenFormBasics = z.infer<typeof zodCreateTokenFormBasics>;

export const zodCreateTokenFormDetails = z.object({
  allowMint: z.boolean(),
  allowBurn: z.boolean(),
});

export type CreateTokenFormDetails = z.infer<typeof zodCreateTokenFormDetails>;

export const emptyCreateTokenFormBasics: CreateTokenFormBasics = {
  caller: "",
  name: "",
  symbol: "",
  decimals: 0,
  totalSupply: "",
  totalSupplyCap: "",
};

export const emptyCreateTokenFormDetails: CreateTokenFormDetails = {
  allowMint: false,
  allowBurn: false,
};

type CreateTokenState = {
  stepIndice: number;
  createTokenFormBasics: CreateTokenFormBasics;
  createTokenFormDetails: CreateTokenFormDetails;
  actions: {
    setBasics: (basics: CreateTokenFormBasics) => void;
    setDetails: (details: CreateTokenFormDetails) => void;
  };
};

const TOTAL_STEPS = 2;

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
