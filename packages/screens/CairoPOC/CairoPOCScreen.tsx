import { useAccount } from "@starknet-react/core";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { constants, Contract, Provider, shortString } from "starknet";

import { Todo } from "./types";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNetworkInfo } from "@/hooks/useSelectedNetwork";
import { mustGetStarknetNetwork } from "@/networks";
import todoListAbi from "@/starknet-contract-abis/todo-list/index.json";

export const CairoPOCScreen = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const { account } = useAccount();
  const selectedNetwork = useSelectedNetworkInfo();
  const { setToast } = useFeedbacks();

  const addTodo = async () => {
    try {
      if (!account) throw Error("Account not connected");

      const starknetNetwork = mustGetStarknetNetwork(selectedNetwork?.id);

      const client = new Contract(
        todoListAbi,
        starknetNetwork.todoListContract,
        account,
      );

      await client.functions.add_todo(`Todo no ${todos.length + 1}`);
      setToast({
        message: "Todo added",
        mode: "mini",
        showAlways: true,
        type: "success",
      });

      setTimeout(() => {
        fetchTodos();
      }, 2000);
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
    const starknetNetwork = mustGetStarknetNetwork(selectedNetwork?.id);

    const provider = new Provider({
      chainId: starknetNetwork.chainId as constants.StarknetChainId,
    });

    const client = new Contract(
      todoListAbi,
      starknetNetwork.todoListContract,
      provider,
    );

    const todosRaw = await client.functions.get_todos();
    const todos: Todo[] = todosRaw.map((todo: any) => ({
      title: shortString.decodeShortString(todo.title),
      isDone: todo.done,
    }));

    setTodos(todos);
  }, [selectedNetwork]);

  const setTodoDone = async (idx: number) => {
    const starknetNetwork = mustGetStarknetNetwork(selectedNetwork?.id);

    const client = new Contract(
      todoListAbi,
      starknetNetwork.todoListContract,
      account,
    );

    await client.functions.set_todo_done(idx);
    setToast({
      message: "Set Todo done",
      mode: "mini",
      showAlways: true,
      type: "success",
    });

    setTimeout(() => {
      fetchTodos();
    }, 2000);
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <ScreenContainer>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <PrimaryButton text="Add Todo" onPress={addTodo} />
      </View>

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
