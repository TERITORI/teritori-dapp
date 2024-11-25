export enum FeedPostingStepId {
  UNDEFINED = "UNDEFINED",
  GENERATING_KEY = "GENERATING_KEY",
  UPLOADING_FILES = "UPLOADING_FILES",
  PROPOSING = "PROPOSING",
  POSTING = "POSTING",
  DONE = "DONE",
}
export interface FeedPostingStep {
  id: FeedPostingStepId;
  label: string;
  progress: number;
}

// Uploading files on IPFS is the longest step, so we progress from .1 to .9 (Visually better on the loading bar)
export const uploadStepProgressStart = 0.1;
export const uploadStepProgressEnd = 0.9;

const feedPostingSteps: FeedPostingStep[] = [
  {
    id: FeedPostingStepId.UNDEFINED,
    label: "",
    progress: 0,
  },
  {
    id: FeedPostingStepId.GENERATING_KEY,
    label: "Generating Upload Key...",
    progress: 0.05,
  },
  {
    id: FeedPostingStepId.UPLOADING_FILES,
    label: "Uploading Files...",
    progress: uploadStepProgressStart,
  },
  {
    id: FeedPostingStepId.PROPOSING,
    label: "Proposing...",
    progress: uploadStepProgressEnd,
  },
  {
    id: FeedPostingStepId.POSTING,
    label: "Posting...",
    progress: uploadStepProgressEnd,
  },
  {
    id: FeedPostingStepId.DONE,
    label: "Done",
    progress: 1,
  },
];

export const feedPostingStep = (id: FeedPostingStepId) =>
  feedPostingSteps.find((step) => step.id === id) || feedPostingSteps[0];
