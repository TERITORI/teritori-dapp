import React from "react";

export type ViewKey =
  | "myInvestments"
  | "myProjects"
  | "milestonesUpdates"
  | "requestsByBuilders"
  | "requestsByInvestors";

type ViewData = {
  name: string;
  component: React.ReactNode;
};

export type TabOption = {
  [key in ViewKey]: ViewData;
};
