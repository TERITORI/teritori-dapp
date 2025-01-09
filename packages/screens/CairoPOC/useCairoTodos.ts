import { useQuery } from "@tanstack/react-query";

export const useCairoTodos = () => {
  return useQuery(["useCairoTodos"], async () => {
    return [
      { title: "task1", isDone: false },
      { title: "task2", isDone: false },
      { title: "task3", isDone: true },
    ];
  });
};
