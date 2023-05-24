import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";

import { TNSModalCommonProps } from "./TNSHomeScreen";
import logoSVG from "../../../assets/logos/logo.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { PrimaryBadge } from "../../components/badges/PrimaryBadge";
import { DAOSelector } from "../../components/dao/DAOSelector";
import ModalBase from "../../components/modals/ModalBase";
import { useTNS } from "../../context/TNSProvider";
import { useNSPrimaryAlias } from "../../hooks/useNSPrimaryAlias";
import { useNSTokensByOwner } from "../../hooks/useNSTokensByOwner";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getUserId } from "../../networks";
import { neutral17, neutral33, neutral77 } from "../../utils/style/colors";
import { fontSemibold14 } from "../../utils/style/fonts";
import { nsTokenWithoutTLD } from "../../utils/tns";

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
  const selectedWallet = useSelectedWallet();
  const [selectedDAOAddress, setSelectedDAOAddress] = useState("");
  const daoId = getUserId(selectedWallet?.networkId, selectedDAOAddress);
  const { tokens } = useNSTokensByOwner(daoId || selectedWallet?.userId);
  const { primaryAlias } = useNSPrimaryAlias(daoId || selectedWallet?.userId);

  const { setName } = useTNS();

  // ==== Init
  useFocusEffect(() => {
    if (!tokens.length) return;

    const firstTokenOnCurrentPage = tokens[0];
    if (!pageStartTokens.includes(firstTokenOnCurrentPage)) {
      setPageStartTokens([...pageStartTokens, firstTokenOnCurrentPage]);
    }
  });

  return (
    <ModalBase
      onClose={() => onClose()}
      hideMainSeparator
      label={` Welcome back, ${primaryAlias} !`}
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

            <DAOSelector
              value={selectedDAOAddress}
              onSelect={setSelectedDAOAddress}
              userId={selectedWallet?.userId}
            />

            {tokens.map((token) => (
              <NameCard
                isPrimary={primaryAlias === token}
                fullName={token}
                key={token}
                style={{ marginBottom: 20 }}
                onPress={() => {
                  setName(nsTokenWithoutTLD(token));
                  onClose(
                    "TNSConsultName",
                    "TNSManage",
                    nsTokenWithoutTLD(token)
                  );
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
