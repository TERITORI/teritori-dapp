import { Fragment } from "react";
import { FlatList, View } from "react-native";

import { AddedToken } from "./components/AddedToken";
import TransactionItem from "./components/TransactionItem";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import transactionSVG from "../../../../assets/icons/transactions-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  neutral88,
  neutralA3,
  secondaryColor,
} from "../../../utils/style/colors";
import {
  fontMedium13,
  fontMedium24,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { useSearchTx } from "../../Wallet/hooks/useSearchTx";
import { useSelectedNativeWallet } from "../../Wallet/hooks/useSelectedNativeWallet";
import { CustomButton } from "../components/Button/CustomButton";

const TokenScreen: ScreenFC<"MiniWallets"> = ({ navigation }) => {
  const selectedWallet = useSelectedNativeWallet();

  const balances = useBalances(
    selectedWallet?.networkId,
    selectedWallet?.address,
  );

  return (
    <>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <BrandText
            style={[
              fontMedium24,
              {
                color: secondaryColor,
              },
            ]}
          >
            $
            {balances
              .reduce((acc, balance) => {
                return acc + (balance.usdAmount || 0);
              }, 0)
              .toFixed(2)}
          </BrandText>
          <BrandText
            style={[
              fontMedium13,
              {
                color: neutral88,
              },
            ]}
          >
            Total balance
          </BrandText>
        </View>
        <View style={{ flexDirection: "row", gap: layout.spacing_x1 }}>
          <CustomButton
            width={72}
            title="Deposit"
            size="medium"
            onPress={() =>
              navigation.navigate("MiniSelectToken", {
                navigateTo: "MiniDepositTORI",
              })
            }
          />
          <CustomButton
            width={72}
            title="Send"
            size="medium"
            onPress={() =>
              navigation.navigate("MiniSelectToken", {
                navigateTo: "MiniSendTori",
              })
            }
            type="gray"
          />
        </View>
      </View>
      <Separator style={{ marginVertical: layout.spacing_x3 }} />
      <FlatList
        data={balances}
        keyExtractor={(item) => item.denom}
        renderItem={({ item: balance }) => (
          <>
            <AddedToken
              dollarAmount={balance.usdAmount?.toLocaleString() || "N/A"}
              icon={teritoriSVG}
              onPress={() => {}}
              denom={balance.denom}
              amount={balance.amount}
            />
            <SpacerColumn size={3} />
          </>
        )}
      />

      <SpacerColumn size={3} />

      <CustomPressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
        onPress={() => navigation.navigate("MiniManageTokens")}
      >
        <SVG source={settingSVG} height={24} width={24} />
        <BrandText style={[fontSemibold14]}>Manage Tokens</BrandText>
      </CustomPressable>
      <Separator style={{ marginVertical: layout.spacing_x3 }} />

      <LastTransactions />
    </>
  );
};

const LastTransactions = () => {
  const selectedWallet = useSelectedNativeWallet();

  const navigation = useAppNavigation();
  const networkId = useSelectedNetworkId();
  const { transactions, isLoading } = useSearchTx(
    networkId,
    selectedWallet?.address,
  );
  console.log("transactions", transactions);

  return (
    <>
      <BrandText
        style={[
          fontSemibold14,
          { color: neutralA3, marginBottom: layout.spacing_x2 },
        ]}
      >
        Last transactions
      </BrandText>

      {!isLoading && (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.txhash}
          ListEmptyComponent={() => (
            <View
              style={{
                flexDirection: "row",
                gap: layout.spacing_x1_5,
                alignItems: "center",
              }}
            >
              <SVG source={transactionSVG} height={24} width={24} />
              <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
                No recent transactions
              </BrandText>
            </View>
          )}
          renderItem={({ item: transaction, index }) => {
            const isLastItem = index === transactions.length - 1;
            if (transaction.tx["@type"] !== "/cosmos.bank.v1beta1.MsgSend") {
              return <></>;
            }

            return (
              <Fragment key={transaction.txHash}>
                {index !== 0 && <SpacerColumn size={2} />}
                <TransactionItem
                  key={transaction.txHash}
                  transaction={transaction}
                  onPress={() =>
                    navigation.navigate("MiniTransactionDetail", {
                      transactionId: transaction.txHash,
                      type: transaction.tx["@type"],
                    })
                  }
                  isLastItem={isLastItem}
                />
              </Fragment>
            );
          }}
        />
      )}
    </>
  );
};

export default TokenScreen;
