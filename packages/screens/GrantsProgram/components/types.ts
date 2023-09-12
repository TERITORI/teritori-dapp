export type StatusId = "open" | "inProgress" | "review" | "completed";

export type Task = {
  id: number;
  text: string;
  statusId: StatusId;
  budget: number;
  github: string;
  priority: "medium" | "hight";
};
