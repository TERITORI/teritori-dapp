import { Project } from "../../utils/projects/types";

export const getProjectStats = (project: Project) => {
  if (!project.milestones)
    return { completed: 0, total: 0, percentCompleted: 0 };
  const completed = project.milestones.filter(
    (ms) => ms.status === "MS_COMPLETED",
  ).length;
  const total = project.milestones.length;
  const percentCompleted = Math.floor((completed / total) * 100);
  return { completed, total, percentCompleted };
};
