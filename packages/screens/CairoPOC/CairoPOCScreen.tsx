import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useCairoTodos } from "./useCairoTodos";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { BrandText } from "@/components/BrandText";
import { Todo } from "./types";

export const CairoPOCScreen = () => {
  const { data: todos, isLoading } = useCairoTodos();

  return (
    <ScreenContainer>
      <PrimaryButton text="Add Todo" />

      {todos?.map((todo: Todo, idx) => {
        return (
          <TertiaryBox key={idx} style={{ marginTop: 12 }}>
            <BrandText
              style={[
                { fontSize: 16, paddingHorizontal: 16, paddingVertical: 4 },
                todo.isDone && {
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                  color: "#666",
                  fontStyle: "italic",
                },
              ]}
            >
              {todo.title}
            </BrandText>
          </TertiaryBox>
        );
      })}
    </ScreenContainer>
  );
};
