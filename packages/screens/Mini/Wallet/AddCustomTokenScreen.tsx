import React, { useState } from "react";
import { Dimensions, View } from "react-native";

import { Select } from "./components/Select";
import { BrandText } from "../../../components/BrandText";
import { ScreenFC } from "../../../utils/navigation";
import {
  neutral22,
  neutral77,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { SettingBase } from "../components/SettingBase";
import { CustomButton } from "../components/CustomButton";

const tokenOptions = [
  {
    label: "TOKEN",
    subLabel: "r/demo/token",
    value: "token",
    record: {
      token: "Token",
      symbol: "TKN",
      path: "r/demo/token",
      decimals: 4,
    },
  },
  {
    label: "TOKEN TOK",
    value: "token",
    subLabel: "r/demo/tokens",
    record: {
      token: "TOKEN TOK",
      symbol: "TOK",
      path: "r/demo/tokens",
      decimals: 5,
    },
  },
  {
    label: "TOKEN TK",
    value: "token",
    subLabel: "r/demo/token",
    record: {
      token: "TOKEN TK",
      symbol: "TK",
      path: "r/demo/token",
      decimals: 3,
    },
  },
  {
    label: "TOKEN TON",
    subLabel: "r/demo/tokens",
    value: "token",
    record: {
      token: "TOKEN TON",
      symbol: "TON",
      path: "r/demo/tokens",
      decimals: 6,
    },
  },
];
type SelectedTokenType = {
  token: string;
  symbol: string;
  path: string;
  decimals: number;
};
const AddCustomTokenScreen: ScreenFC<"MiniAddCustomToken"> = ({
  navigation,
}) => {
  const [selectedToken, setSelectedToken] = useState<SelectedTokenType | null>(
    null,
  );
  const [searchToken, setSearchToken] = useState("");

  const gotoManageTokens = () => navigation.replace("MiniManageTokens");

  const onSelectTokenChange = (value: string, record: typeof selectedToken) => {
    setSelectedToken(record);
  };

  const onSearchToken = (text: string) => {
    setSearchToken(text);
  };

  const onAddToken = () => {};

  return (
    <SettingBase
      title="Add Custom Token"
      reverseView={false}
      onGoBack={gotoManageTokens}
      background="transparent"
    >
      <View
        style={{
          gap: layout.spacing_x1_5,
          marginTop: layout.spacing_x2_5,
          paddingHorizontal: layout.spacing_x1_5,
          height: Dimensions.get("window").height - 150,
        }}
      >
        <Select
          selected={selectedToken?.token || ""}
          onSelect={onSelectTokenChange}
          options={tokenOptions}
          onSearchChange={onSearchToken}
          searchValue={searchToken}
          placeholder="Select a GRC20 Token"
        />
        <TokenInfoRow
          label="Token Symbol"
          value={selectedToken?.symbol || ""}
        />
        <TokenInfoRow label="Token Path" value={selectedToken?.path || ""} />
        <TokenInfoRow
          label="Token Decimals"
          value={selectedToken?.decimals || ""}
        />
        <CustomButton
          onPress={onAddToken}
          style={{
            position: "absolute",
            bottom: 0,
            left: layout.spacing_x2,
            right: layout.spacing_x2,
            zIndex: 99,
          }}
          title="Add"
        />
      </View>
    </SettingBase>
  );
};

export default AddCustomTokenScreen;

type InfoProps = {
  label: string;
  value: string | number | null;
};
const TokenInfoRow = ({ label, value }: InfoProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: neutral22,
        borderRadius: 10,
        alignItems: "center",
        padding: layout.spacing_x2,
      }}
    >
      <BrandText style={[fontMedium16, { color: neutral77 }]}>
        {label} :
      </BrandText>
      <BrandText style={[fontMedium16, { color: secondaryColor }]}>
        {value}
      </BrandText>
    </View>
  );
};
