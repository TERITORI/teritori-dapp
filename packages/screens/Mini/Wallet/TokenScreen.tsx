import { Fragment } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import { AddedToken } from "./components/AddedToken";
import TransactionItem, { TransactionType } from "./components/TransactionItem";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import settingSVG from "../../../../assets/icons/setting-solid.svg";
import transactionSVG from "../../../../assets/icons/transactions-gray.svg";
import { BrandText } from "../../../components/BrandText";
import { SVG } from "../../../components/SVG";
import { CustomPressable } from "../../../components/buttons/CustomPressable";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { useBalances } from "../../../hooks/useBalances";
import { selectAllWallets } from "../../../store/slices/wallets";
import { ScreenFC } from "../../../utils/navigation";
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
import { CustomButton } from "../components/CustomButton";

const transactions: TransactionType[] = [
  {
    id: "nsidfidf",
    type: "send",
    status: "pending",
    img: "",
    coin: { amount: "2000", denom: "TORI", dollar: 637.42 },
    to: "gjjsdifjidjfd",
  },
  {
    id: "nsidfidfadf",
    type: "send",
    status: "success",
    img: "https://images.unsplash.com/photo-1704834310326-70f4826650cd?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    coin: { amount: "1000", denom: "TORI", dollar: 337.42 },
    to: "gjjsdifjidjfd",
  },
];

const TokenScreen: ScreenFC<"MiniWallets"> = ({ navigation }) => {
  const onDepositPress = () => {
    navigation.navigate("MiniSelectToken", { navigateTo: "MiniDepositTORI" });
  };
  const onSendPress = () => {
    navigation.navigate("MiniSelectToken", { navigateTo: "MiniSendTori" });
  };
  const handlePressManageTokens = () => {
    navigation.navigate("MiniManageTokens");
  };

  const wallets = useSelector(selectAllWallets);
  console.log(wallets);
  const balances = useBalances("teritori", wallets[0].publicKey);
  console.log(balances);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          paddingTop: layout.spacing_x3,
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
            onPress={onDepositPress}
          />
          <CustomButton
            width={72}
            title="Send"
            size="medium"
            onPress={onSendPress}
            type="gray"
          />
        </View>
      </View>
      <Separator style={{ marginVertical: layout.spacing_x3 }} />
      {balances.map((balance) => (
        <>
          <AddedToken
            code="3A31"
            dollarAmount={balance.usdAmount?.toLocaleString() || "N/A"}
            icon={teritoriSVG}
            key={balance.denom}
            onPress={() => {}}
            denom={balance.denom}
            amount={balance.amount}
          />
          <SpacerColumn size={3} />
        </>
      ))}

      <SpacerColumn size={3} />

      <CustomPressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1_5,
        }}
        onPress={handlePressManageTokens}
      >
        <SVG source={settingSVG} height={24} width={24} />
        <BrandText style={[fontSemibold14, {}]}>Manage Tokens</BrandText>
      </CustomPressable>
      <Separator style={{ marginVertical: layout.spacing_x3 }} />

      <BrandText
        style={[
          fontSemibold14,
          { color: neutralA3, marginBottom: layout.spacing_x2 },
        ]}
      >
        Last transactions
      </BrandText>

      {!transactions.length ? (
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
      ) : (
        transactions.map((transaction, index) => {
          const isLastItem = index === transactions.length - 1;

          return (
            <Fragment key={transaction.id}>
              {index !== 0 && <SpacerColumn size={2} />}
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onPress={() =>
                  navigation.navigate("MiniTransactionDetail", {
                    transactionId: transaction.id,
                    type: transaction.type,
                  })
                }
                isLastItem={isLastItem}
              />
            </Fragment>
          );
        })
      )}
    </>
  );
};

export default TokenScreen;
