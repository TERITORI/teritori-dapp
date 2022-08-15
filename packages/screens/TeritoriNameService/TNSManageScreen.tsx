import { useFocusEffect } from "@react-navigation/native";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { Image, TouchableOpacity, View, ViewStyle } from "react-native";

import flowCardPNG from "../../../assets/cards/name-card.png";
import logoSmPNG from "../../../assets/logo-sm.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { PrimaryPill } from "../../components/pills/PrimaryPill";
import { TNSContext } from "../../context/TNSProvider";
import { noTokens, useTokenList } from "../../hooks/tokens";
import { useAreThereWallets } from "../../hooks/useAreThereWallets";
import { usePrimaryAlias } from "../../hooks/usePrimaryAlias";
import { useStore } from "../../store/cosmwasm";
import { tokenWithoutTld } from "../../utils/tns";
import { useAppNavigation } from "../../utils/navigation";

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
      <Image source={flowCardPNG} style={{ width, height, position: "absolute", resizeMode: "stretch" }}/>
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
          <PrimaryPill label="Primary" style={{ marginRight: 20 }} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

export const TNSManageScreen: React.FC = () => {
  const [pageStartTokens, setPageStartTokens] = useState<string[]>([]);
  const { setTnsLoading } = useContext(TNSContext);
  const { tokens, loadingTokens } = useTokenList();
  const { alias, loadingAlias } = usePrimaryAlias();
  const navigation = useAppNavigation();
  const userHasCoWallet = useAreThereWallets();
  const signingClient = useStore((state) => state.signingClient);
  const titleFontSize = 48;
  const subTitleFontSize = 28;

  // Sync tnsLoading
  useEffect(() => {
    setTnsLoading(loadingTokens);
  }, [loadingTokens]);
  useEffect(() => {
    setTnsLoading(loadingAlias);
  }, [loadingAlias]);

  // ==== Init
  useFocusEffect(() => {
    // ---- When this screen is called, if the user has no wallet, we go home (We are waiting for tokens state)
    // ===== Controls many things, be careful
    if ((tokens && !userHasCoWallet) || !signingClient)
      navigation.navigate("TNSHome");
    if (noTokens(tokens)) return;

    const firstTokenOnCurrentPage = tokens[0];
    if (!R.includes(firstTokenOnCurrentPage, pageStartTokens)) {
      setPageStartTokens(R.append(firstTokenOnCurrentPage, pageStartTokens));
    }
  });

  return (
    <ScreenContainer2
      footerChildren={<BacKTo label="home" navItem="TNSHome" />}
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

        {noTokens(tokens) ? (
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
    </ScreenContainer2>
  );
};



// ----- Pagination TODO:
// const handlePrev = getHandlePrev(
//   page,
//   pageStartTokens,
//   setPage,
//   setStartAfter
// );
// const handleNext = getHandleNext(
//   page,
//   pathsAndTokens,
//   setPage,
//   setStartAfter
// );


{/*// ---------- Paths TODO: ?*/}
{/*<BrandText*/}
{/*		style={{*/}
{/*				fontSize: subTitleFontSize,*/}
{/*				lineHeight: 32,*/}
{/*				letterSpacing: -(subTitleFontSize * 0.04),*/}
{/*				marginBottom: 20,*/}
{/*				marginTop: 8*/}
{/*		}}*/}
{/*>*/}
{/*		Manage your paths*/}
{/*</BrandText>*/}

{/*{!R.isEmpty(paths)*/}
{/*		? paths.map(path => (*/}
{/*						<NameCard*/}
{/*								fullName={path.fullName} key={path.fullName}*/}
{/*								style={{marginTop: 20}}*/}
{/*								isPrimary={path.isPrimary}*/}
{/*								onPress={() => onPressNameCard(path)}*/}
{/*						/>*/}
{/*				))*/}
{/*		: null*/}
{/*}*/}