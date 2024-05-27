import { useRoute } from "@react-navigation/native";
import { useMemo } from "react";
import * as yup from "yup";
import { create } from "zustand";

import { useAppNavigation } from "../../../utils/navigation";
import { emptyProjectFormData, fakeTeamAndLink } from "../defaultValues";
import { ProjectMilestone } from "../types";

export const yupProjectTeamAndLinkFormData = yup.object({
  websiteLink: yup.string().required().url(),
  twitterProfile: yup.string().required().url(),
  discordLink: yup.string().required().url(),
  githubLink: yup.string().required().url(),
  teamDesc: yup.string().required(),
});

export type ProjectTeamAndLinkFormData = yup.InferType<
  typeof yupProjectTeamAndLinkFormData
>;

export const yupProjectFormData = yup.object({
  name: yup.string().required().min(3),
  desc: yup.string().required().min(10),
  funder: yup.string(),
  contractor: yup.string().min(32),
  arbitrator: yup.string().required(),
  tags: yup.string().nullable(),
  coverImg: yup.object(),
});

export type ProjectFormData = yup.InferType<typeof yupProjectFormData>;

type MakeRequestState = {
  stepIndice: number;
  projectFormData: ProjectFormData;
  teamAndLinkData: ProjectTeamAndLinkFormData;
  milestones: ProjectMilestone[];
  actions: {
    // setStepIndice: (stepIndice: number) => void;
    setShortDesc: (shortDescData: ProjectFormData) => void;
    setTeamAndLink: (teamAndLinkData: ProjectTeamAndLinkFormData) => void;

    addMilestone: (milestone: ProjectMilestone) => void;
    removeMilestone: (milestone: ProjectMilestone) => void;
  };
};

const TOTAL_STEPS = 5;

const useMakeRequestStore = create<MakeRequestState>((set, get) => ({
  stepIndice: 1,
  projectFormData: emptyProjectFormData,
  teamAndLinkData: fakeTeamAndLink,
  milestones: [],
  actions: {
    // setStepIndice: (stepIndice: number) => set({ stepIndice }),
    setShortDesc: (shortDescData) => set({ projectFormData: shortDescData }),
    setTeamAndLink: (teamAndLinkData) => {
      set({ teamAndLinkData });
    },
    addMilestone: (milestone) => {
      const updatedMilestones = [...get().milestones, milestone].map(
        (t, idx) => {
          t.id = idx.toString();
          return t;
        },
      );

      set({ milestones: updatedMilestones });
    },
    removeMilestone: (milestone) => {
      const updatedMilestones = get()
        .milestones.filter((t) => t.id !== milestone.id)
        .map((t, idx) => {
          t.id = idx.toString();
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

  // const setStep = store.actions.setStepIndice;

  const gotoStep = (stepIndex: number) => {
    // store.actions.setStepIndice(stepIndice);
    navigation.navigate("ProjectsMakeRequest", { step: stepIndex });
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
      // setStep,
    },
  };
};
