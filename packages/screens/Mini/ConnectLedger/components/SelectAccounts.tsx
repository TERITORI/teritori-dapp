import React, { useState } from "react";
import { useWindowDimensions, View } from "react-native";

import circularPlusSVG from "../../../../../assets/icons/plus-white-circular.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import {
  neutral17,
  neutral39,
  neutral77,
} from "../../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold15,
  fontSemibold30,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/CustomButton";
import { CustomCheckbox } from "../../components/CustomCheckbox";
import { StepType } from "../ConnectLedgerScreen";

type Props = {
  onStepChange: (step: StepType) => void;
};

const accountDetails = [
  {
    token: "g19f4g10nz0wchvkkj7rr09vcxj5rpt2mzp4q",
    account: "Account 1",
    path: "m/45’/119’/0’/0/0",
  },
  {
    token: "g1ck4g10nz0wchvkkj7rr09vcxj5rpt2mc3kg",
    account: "Account 2",
    path: "m/45’/119’/0’/0/1",
  },
  {
    token: "g1q34g10nz0wchvkkj7rr09vcxj5rpt2mz5er",
    account: "Account 3",
    path: "m/45’/119’/0’/0/2",
  },
];

export const SelectAccounts = ({ onStepChange }: Props) => {
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const { width: windowWidth } = useWindowDimensions();

  const onPressClose = () => {
    onStepChange("step_6");
  };

  const onLoadMoreAccountsPress = () => {
    alert("load more.");
  };

  const onSelectAccountPress = (token: string) =>
    setSelectedAccounts((prev) =>
      prev.includes(token) ? prev.filter((x) => x !== token) : [...prev, token],
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", paddingTop: 80, flex: 1 }}>
        <View
          style={{
            height: 152,
            width: 152,
            marginBottom: layout.spacing_x4,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: neutral17,
            borderRadius: 100,
          }}
        >
          <SVG source={circularPlusSVG} height={40} width={40} />
        </View>
        <BrandText
          style={[
            fontSemibold30,
            {
              textAlign: "center",
              lineHeight: 36,
              marginBottom: layout.spacing_x2_5,
            },
          ]}
        >
          Select Accounts
        </BrandText>
        <View
          style={{
            marginBottom: layout.spacing_x1_5,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: neutral17,
            borderRadius: 10,
            width: "100%",
            paddingHorizontal: layout.spacing_x2,
          }}
        >
          {accountDetails.map((account) => {
            return (
              <Account
                key={account.account}
                isSelected={selectedAccounts.includes(account.token)}
                onSelect={() => onSelectAccountPress(account.token)}
                path={account.path}
                token={account.token}
              />
            );
          })}
        </View>
        <CustomPressable
          onPress={onLoadMoreAccountsPress}
          style={{
            borderColor: neutral39,
            borderWidth: 1,
            borderRadius: 30,
            paddingHorizontal: layout.spacing_x2_5,
            paddingVertical: layout.spacing_x1_5,
          }}
        >
          <BrandText style={[fontSemibold15, {}]}>Load more accounts</BrandText>
        </CustomPressable>
      </View>
      <CustomButton
        title="Next"
        onPress={onPressClose}
        width={windowWidth - 20}
        style={{
          position: "absolute",
          bottom: 30,
          left: 10,
          right: 10,
        }}
      />
    </View>
  );
};

type AccountProps = {
  isSelected: boolean;
  onSelect: () => void;
  token: string;
  path: string;
};

const Account = ({ isSelected, onSelect, path, token }: AccountProps) => {
  const shortenToken = (token: string) => {
    return `${token.substring(0, 4)}...${token.substring(
      token.length - 4,
      token.length,
    )}`;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: layout.spacing_x1_5,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x2_5,
        }}
      >
        <BrandText style={[fontMedium16, {}]}>{shortenToken(token)}</BrandText>
        <BrandText style={[fontMedium16, { color: neutral77 }]}>
          {path}
        </BrandText>
      </View>
      <CustomCheckbox isChecked={isSelected} onPress={onSelect} />
    </View>
  );
};
