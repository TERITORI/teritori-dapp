import React from "react";

export type ViewKey =
  | "myInvestments"
  | "myProjects"
  | "milestonesUpdates"
  | "contractorCandidates"
  | "requestsByInvestors";

type ViewData = {
  name: string;
  component: React.ReactNode;
};

export type TabOption = {
  [key in ViewKey]: ViewData;
};
