import { ScreenContainer } from "@/components/ScreenContainer";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useCairoTodos } from "./useCairoTodos";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { BrandText } from "@/components/BrandText";
import { Todo } from "./types";
import { useBalance, useNetwork, useReadContract } from "@starknet-react/core";
import {
  useSelectedNetworkId,
  useSelectedNetworkInfo,
} from "@/hooks/useSelectedNetwork";
import { StarknetNetworkInfo } from "@/networks";
import abi from "./abi.json";

export const CairoPOCScreen = () => {
  const { data: todos, isLoading } = useCairoTodos();
  const selectedNetwork = useSelectedNetworkInfo();

  const {
    data,
    error,
    isLoading: isReadingContract,
  } = useReadContract({
    abi,
    functionName: "get_balance",
    address: (selectedNetwork as StarknetNetworkInfo).defaultContract,
    args: [],
  });

  console.log({
    data,
    error,
    isReadingContract,
    address: (selectedNetwork as StarknetNetworkInfo).defaultContract,
  });

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
