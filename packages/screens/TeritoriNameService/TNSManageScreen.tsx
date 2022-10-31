import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import logoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { PrimaryBadge } from "../../components/badges/PrimaryBadge";
import ModalBase from "../../components/modals/ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useTNS } from "../../context/TNSProvider";
import { useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { useIsKeplrConnected } from "../../hooks/useIsKeplrConnected";
import { usePrimaryAlias } from "../../hooks/usePrimaryAlias";
import { useAppNavigation } from "../../utils/navigation";
import { neutral17, neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { tokenWithoutTld } from "../../utils/tns";
import { TNSModalCommonProps } from "./TNSHomeScreen";

const NameCard: React.FC<{
  fullName: string;
  isPrimary?: boolean;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
}> = ({ fullName, isPrimary, style, onPress }) => {
  const height = 84;

  return (
    <TouchableOpacity
      style={[
        style,
        {
          width: "100%",
          backgroundColor: neutral17,
          borderWidth: 1,
          borderColor: neutral33,
          borderRadius: 8,
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height,
          minHeight: height,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SVG
            width={44}
            height={44}
            source={logoSVG}
            style={{
              marginLeft: 20,
              marginRight: 12,
            }}
          />
          <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
            {fullName}
          </BrandText>
        </View>

        {isPrimary ? (
          <PrimaryBadge label="Primary" style={{ marginRight: 20 }} size="SM" />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

interface TNSManageScreenProps extends TNSModalCommonProps {}

export const TNSManageScreen: React.FC<TNSManageScreenProps> = ({
  onClose,
}) => {
  const [pageStartTokens, setPageStartTokens] = useState<string[]>([]);
  const { setLoadingFullScreen } = useFeedbacks();
  const { tokens, loadingTokens } = useTokenList();
  const { alias, loadingAlias } = usePrimaryAlias();
  const navigation = useAppNavigation();
  const userHasCoWallet = useAreThereWallets();
  const isKeplrConnected = useIsKeplrConnected();
  const { setName } = useTNS();

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
      navigation.navigate("TNSHome", {
        modal: "",
      });
    if (!tokens.length) return;

    const firstTokenOnCurrentPage = tokens[0];
    if (!pageStartTokens.includes(firstTokenOnCurrentPage)) {
      setPageStartTokens([...pageStartTokens, firstTokenOnCurrentPage]);
    }
  });

  return (
    <ModalBase
      onClose={onClose}
      hideMainSeparator
      label={` Welcome back, ${alias} !`}
      width={457}
    >
      <View style={{ flex: 1, alignItems: "center" }}>
        {!tokens.length ? (
          <BrandText style={{ marginVertical: 40 }}>No token</BrandText>
        ) : (
          <>
            {/*// ---------- Tokens*/}
            <BrandText
              style={[
                fontSemibold14,
                {
                  color: neutral77,
                  alignSelf: "flex-start",
                  marginBottom: 20,
                },
              ]}
            >
              Manage your names
            </BrandText>

            {tokens.map((token) => (
              <NameCard
                isPrimary={alias === token}
                fullName={token}
                key={token}
                style={{ marginBottom: 20 }}
                onPress={() => {
                  setName(tokenWithoutTld(token));
                  onClose("TNSConsultName", "TNSManage");
                }}
              />
            ))}
          </>
        )}

        {/*TODO: PrevNext buttons*/}
      </View>
    </ModalBase>
  );
};
