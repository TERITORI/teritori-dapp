import { useAccount, useContract } from "@starknet-react/core";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { Abi, shortString } from "starknet";

import { Todo } from "./types";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { StarknetNetworkInfo } from "@/networks";
import { abi as todoListAbi } from "@/starknet-contract-clients/todo_list/abi.json";

export const CairoPOCScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTx, setCurrentTx] = useState<string | null>(null);

  const { account } = useAccount();
  const selectedNetwork = useSelectedNetworkInfo();
  const { setToast } = useFeedbacks();

  const { contract } = useContract({
    abi: todoListAbi as Abi,
    address: (selectedNetwork as StarknetNetworkInfo)?.todoListContractAddress,
  });

  const addTodo = async () => {
    try {
      contract.connect(account);
      const { transaction_hash } = await contract.add_todo(
        `Todo no ${todos.length + 1}`,
      );
      setCurrentTx(transaction_hash);

      const provider = contract.providerOrAccount;
      const result = await provider.waitForTransaction(transaction_hash);

      if (result.statusReceipt === "success") {
        setCurrentTx(null);
      } else {
        console.error({ result });
        throw Error("Transaction failed");
      }

      setToast({
        message: "Todo added",
        mode: "mini",
        showAlways: true,
        type: "success",
      });

      fetchTodos();
    } catch (e: any) {
      setToast({
        message: e.message,
        mode: "mini",
        showAlways: true,
        type: "error",
      });
    }
  };

  const fetchTodos = useCallback(async () => {
    if (!contract) return;

    const todosRaw = await contract.get_todos();
    const todos: Todo[] = todosRaw.map((todo: any) => ({
      title: shortString.decodeShortString(todo.title),
      isDone: todo.done,
    }));

    setTodos(todos);
  }, [contract]);

  const setTodoDone = async (idx: number) => {
    try {
      contract.connect(account);
      const { transaction_hash } = await contract.set_todo_done(idx);
      setCurrentTx(transaction_hash);

      const provider = contract.providerOrAccount;
      const result = await provider.waitForTransaction(transaction_hash);

      if (result.statusReceipt === "success") {
        setCurrentTx(null);
      } else {
        console.error({ result });
        throw Error("Transaction failed");
      }

      setToast({
        message: "Set Todo done",
        mode: "mini",
        showAlways: true,
        type: "success",
      });

      fetchTodos();
    } catch (e: any) {
      setToast({
        message: e.message,
        mode: "mini",
        showAlways: true,
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton text="Add Todo" onPress={addTodo} />
      </View>

      {currentTx && <BrandText>Executing tx: {currentTx}</BrandText>}

      {todos?.map((todo: Todo, idx) => {
        return (
          <TertiaryBox key={idx} style={{ marginTop: 12 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
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
                {todo.title} - Done: {todo.isDone ? "Yes" : "No"}
              </BrandText>

              {!todo.isDone && (
                <PrimaryButton
                  size="SM"
                  text="Set done"
                  onPress={() => setTodoDone(idx)}
                />
              )}
            </View>
          </TertiaryBox>
        );
      })}
    </ScreenContainer>
  );
};
