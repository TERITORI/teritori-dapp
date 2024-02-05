import React from "react";
import { FlatList, View } from "react-native";

import { ManageToken } from "./components/ManageToken";
import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import { Separator } from "../../../components/separators/Separator";
import { useBalances } from "../../../hooks/useBalances";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { useSelectedNativeWallet } from "../../Wallet/hooks/useSelectedNativeWallet";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

export const ManageTokensScreen: ScreenFC<"MiniManageTokens"> = ({
  navigation,
}) => {
  const onPressAddToken = () => {
    navigation.replace("MiniAddCustomToken");
  };

  const selectedWallet = useSelectedNativeWallet();

  const balances = useBalances(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );

  return (
    <BlurScreenContainer title="Manage Tokens">
      <View
        style={{
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <FlatList
          data={balances}
          keyExtractor={(item) => item.denom}
          renderItem={({ item: balance }) => (
            <ManageToken
              amount={balance.amount}
              showSwitch={balance.denom !== "utori"}
              denom={balance.denom}
            />
          )}
        />
        <Separator />
        <ListView
          onPress={onPressAddToken}
          style={{
            paddingVertical: layout.spacing_x4,
          }}
          options={{
            label: "Add Token",
            leftIconEnabled: true,
            iconEnabled: true,
            leftIconOptions: {
              icon: AddNewSvg,
              fill: "#fff",
            },
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};
