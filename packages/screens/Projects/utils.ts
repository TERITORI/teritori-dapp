import { MsStatus, Project } from "./types";

export const getProjectStats = (project: Project) => {
  const completed = project.milestones.filter(
    (ms) => ms.status === MsStatus.MS_COMPLETED,
  ).length;
  const total = project.milestones.length;
  const percentCompleted = Math.floor((completed / total) * 100);
  return { completed, total, percentCompleted };
};
