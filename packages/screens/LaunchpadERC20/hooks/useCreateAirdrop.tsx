import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import { z } from "zod";
import { create } from "zustand";

import { useAppNavigation } from "@/utils/navigation";

export const zodCreateAirdropForm = z.object({
  caller: z.string().min(3),
  tokenName: z.string().min(3),
  merkleRoot: z.string().min(1),
  amountPerAddr: z.number().int().min(1),
  startTimestamp: z.number().int().min(0).optional(), // replace by date parsing w/ a date picker component
  endTimestamp: z.number().int().min(0).optional(), // replace by date parsing w/ a date picker component
});

export type CreateAirdropForm = z.infer<typeof zodCreateAirdropForm>;

export const emptyCreateAirdropForm: CreateAirdropForm = {
  caller: "",
  tokenName: "",
  merkleRoot: "",
  amountPerAddr: 0,
  startTimestamp: undefined,
  endTimestamp: undefined,
};

type CreateAirdropState = {
  stepIndice: number;
  createAirdropForm: CreateAirdropForm;
  actions: {
    setAirdrop: (airdrop: CreateAirdropForm) => void;
  };
};

const TOTAL_STEPS = 2;

const useCreateAirdropStore = create<CreateAirdropState>((set) => ({
  stepIndice: 1,
  createAirdropForm: emptyCreateAirdropForm,
  actions: {
    setAirdrop: (airdrop) => set({ createAirdropForm: airdrop }),
  },
}));

export const useCreateAirdropState = () => {
  const navigation = useAppNavigation();
  const store = useCreateAirdropStore();
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
    navigation.navigate("LaunchpadERC20CreateAirdrop", { step: stepIndex });
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
