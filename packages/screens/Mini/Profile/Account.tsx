import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Linking, Pressable, View } from "react-native";

import copySVG from "../../../../assets/icons/copy-gray.svg";
import dotSVG from "../../../../assets/icons/dots-gray.svg";
import checkedLogo from "../../../../assets/icons/greenCheck.svg";
import infoSVG from "../../../../assets/icons/info-circle-gray.svg";
import openSVG from "../../../../assets/icons/open-gray.svg";

import googleSVG from "@/assets/icons/google.svg";
import ledgerSVG from "@/assets/icons/ledger.svg";
import questionSVG from "@/assets/icons/question-gray.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { SVGorImageIcon } from "@/components/SVG/SVGorImageIcon";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { DropdownWithListItem } from "@/components/mini/DropdownWithListItem";
import { useAppNavigation } from "@/hooks/navigation/useAppNavigation";
import { accountExplorerLink } from "@/networks";
import { StoreWallet } from "@/store/slices/wallets";
import { neutral33, neutralA3 } from "@/utils/style/colors";
import { fontMedium13, fontSemibold22 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

type ProviderType = StoreWallet["provider"];
const getProviderLogo = (provider: ProviderType) => {
  switch (provider) {
    case "google":
      return googleSVG;
    case "ledger":
      return ledgerSVG;
    case "native":
      return null; //teritoriSVG?;
    default:
      return questionSVG;
  }
};

export const Account: React.FC<{ account: StoreWallet; isLast: boolean }> = ({
  account,
  isLast = false,
}) => {
  const navigation = useAppNavigation();
  const navigateToAccountDetails = () => {
    navigation.replace("MiniAccountDetails", {
      id: account.index.toString(),
      accountName: account.name,
    });
  };
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = async (address: string) => {
    setIsCopied(true);
    await Clipboard.setStringAsync(address);
    setInterval(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        paddingVertical: layout.spacing_x1_5,
        marginBottom: isLast ? 0 : layout.spacing_x1_5,
      }}
    >
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: layout.spacing_x1,
          }}
        >
          <BrandText style={[fontSemibold22]}>{account.name}</BrandText>
          <Pressable onPress={() => copyToClipboard(account.address)}>
            <SVG
              source={isCopied ? checkedLogo : copySVG}
              height={20}
              width={20}
            />
          </Pressable>
        </View>

        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          {`${tinyAddress(account.address, 16)}`}
        </BrandText>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: layout.spacing_x1,
        }}
      >
        {getProviderLogo(account.provider) && (
          <CustomPressable
            style={{
              backgroundColor: neutral33,
              padding: layout.spacing_x1,
              borderRadius: 10,
              zIndex: -10,
            }}
          >
            <SVGorImageIcon
              icon={getProviderLogo(account.provider)}
              iconSize={20}
            />
          </CustomPressable>
        )}
        <DropdownWithListItem
          style={{ paddingHorizontal: 0, width: 210 }}
          positionStyle={{ top: 35 }}
          icon={dotSVG}
          iconSize={22}
          items={[
            {
              name: "View on Explorer",
              icon: openSVG,
              onPress: () => {
                Linking.openURL(
                  accountExplorerLink(account.networkId, account.address),
                );
              },
            },
            {
              name: "Account Details",
              icon: infoSVG,
              onPress: navigateToAccountDetails,
            },
          ]}
        />
      </View>
    </View>
  );
};
