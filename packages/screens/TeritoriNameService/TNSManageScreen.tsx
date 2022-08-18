import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ViewStyle } from "react-native";

import flowCardPNG from "../../../assets/cards/name-card.png";
import logoSmPNG from "../../../assets/logo-sm.png";
import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryBadge } from "../../components/badges/PrimaryBadge";
import { BackTo } from "../../components/navigation/BackTo";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { usePrimaryAlias } from "../../hooks/usePrimaryAlias";
import { useAppNavigation } from "../../utils/navigation";
import { tokenWithoutTld } from "../../utils/tns";

const NameCard: React.FC<{
  fullName: string;
  isPrimary?: boolean;
  style: ViewStyle;
  onPress: () => void;
}> = ({ fullName, isPrimary, style, onPress }) => {
  const width = 392;
  const height = 84;

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={flowCardPNG}
        style={{ width, height, position: "absolute", resizeMode: "stretch" }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height,
          minHeight: height,
          width,
          minWidth: width,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Image
            source={logoSmPNG}
            style={{
              width: 44,
              height: 44,
              resizeMode: "stretch",
              marginLeft: 20,
              marginRight: 12,
            }}
          />
          <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
            {fullName}
          </BrandText>
        </View>

        {isPrimary ? (
          <PrimaryBadge label="Primary" style={{ marginRight: 20 }} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export const TNSManageScreen: React.FC = () => {
  const [pageStartTokens, setPageStartTokens] = useState<string[]>([]);
  const { setLoadingFullScreen } = useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const { alias, loadingAlias } = usePrimaryAlias();
  const navigation = useAppNavigation();
  const userHasCoWallet = useAreThereWallets();
  const isKeplrConnected = useIsKeplrConnected();
  const titleFontSize = 48;
  const subTitleFontSize = 28;

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);
  useEffect(() => {
    setLoadingFullScreen(loadingAlias);
  }, [loadingAlias]);

  // ==== Init
  useFocusEffect(() => {
    // ---- When this screen is called, if the user has no wallet, we go home (We are waiting for tokens state)
    // ===== Controls many things, be careful
    if ((tokens && !userHasCoWallet) || !isKeplrConnected)
      navigation.navigate("TNSHome");
    if (!tokens.length) return;

    const firstTokenOnCurrentPage = tokens[0];
    if (!pageStartTokens.includes(firstTokenOnCurrentPage)) {
      setPageStartTokens([...pageStartTokens, firstTokenOnCurrentPage]);
    }
  });

  return (
    <ScreenContainer
      hideSidebar
      headerStyle={{ borderBottomColor: "transparent" }}
      footerChildren={<BackTo label="Back to home" navItem="TNSHome" />}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        {/*TODO: Gradient text green-blue*/}
        <BrandText
          style={{
            fontSize: titleFontSize,
            lineHeight: 64,
            letterSpacing: -(titleFontSize * 0.04),
            marginTop: 32,
          }}
        >
          Welcome back, {alias} !
        </BrandText>
        {/*TODO: Gradient text green-blue*/}

        {!tokens.length ? (
          <BrandText style={{ marginTop: 40 }}>No token</BrandText>
        ) : (
          <>
            {/*// ---------- Tokens*/}
            <BrandText
              style={{
                fontSize: subTitleFontSize,
                lineHeight: 32,
                letterSpacing: -(subTitleFontSize * 0.04),
                marginBottom: 20,
                marginTop: 8,
              }}
            >
              Manage your names
            </BrandText>

            {tokens.map((token) => (
              <NameCard
                isPrimary={alias === token}
                fullName={token}
                key={token}
                style={{ marginTop: 20 }}
                onPress={() =>
                  navigation.navigate("TNSConsultName", {
                    name: tokenWithoutTld(token),
                  })
                }
              />
            ))}
          </>
        )}

        {/*TODO: PrevNext buttons*/}
      </View>
    </ScreenContainer>
  );
};
