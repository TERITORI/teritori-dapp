import React, { useMemo } from "react";
import { ActivityIndicator, FlatList, View, ViewStyle } from "react-native";

import { GetStartedOption } from "./components/GetStartedOption";
import multisigWalletSVG from "../../../assets/icons/organization/multisig-wallet.svg";
import postJobSVG from "../../../assets/icons/organization/post-job.svg";
import useSelectedWallet from "../../hooks/useSelectedWallet";

import { JoinState } from "@/api/multisig/v1/multisig";
import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenTitle } from "@/components/ScreenContainer/ScreenTitle";
import { AnimationFadeIn } from "@/components/animations/AnimationFadeIn";
import { LoginButton } from "@/components/multisig/LoginButton";
import { MultisigTransactions } from "@/components/multisig/MultisigTransactions";
import { SpacerColumn } from "@/components/spacer";
import { useMultisigAuthToken } from "@/hooks/multisig/useMultisigAuthToken";
import { useUserMultisigs } from "@/hooks/multisig/useUserMultisigs";
import { getUserId } from "@/networks";
import { ScreenFC, useAppNavigation } from "@/utils/navigation";
import { neutral77, secondaryColor } from "@/utils/style/colors";
import { fontRegular16, fontRegular28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { tinyAddress } from "@/utils/text";

export const MultisigScreen: ScreenFC<"Multisig"> = () => {
  const navigation = useAppNavigation();
  const selectedWallet = useSelectedWallet();
  const authToken = useMultisigAuthToken(selectedWallet?.userId);

  const {
    multisigs: data,
    isLoading: isMultisigLoading,
    isFetching: isMultisigFetching,
  } = useUserMultisigs(selectedWallet?.userId, JoinState.JOIN_STATE_IN);

  const { multisigs: invitations } = useUserMultisigs(
    selectedWallet?.userId,
    JoinState.JOIN_STATE_OUT,
  );

  const Header: React.FC = useMemo(() => {
    return () => (
      <>
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BrandText style={fontRegular28}>My Multisigs</BrandText>
            <LoginButton userId={selectedWallet?.userId} />
          </View>
          <SpacerColumn size={1.5} />
          <BrandText style={[fontRegular16, { color: neutral77 }]}>
            Overview of your Multisignatures Wallets
          </BrandText>
          <SpacerColumn size={2.5} />
          <FlatList
            data={data}
            horizontal
            scrollEnabled={false}
            keyExtractor={(item) => item.address}
            contentContainerStyle={{
              gap: layout.spacing_x2,
              flexWrap: "wrap",
              width: "100%",
            }}
            renderItem={({ item, index }) => (
              <GetStartedOption
                variant="small"
                title={item.name || `Multisig #${(data?.length || 0) - index}`}
                icon={multisigWalletSVG}
                isBetaVersion
                onPress={() =>
                  navigation.navigate("MultisigWalletDashboard", {
                    id: getUserId(selectedWallet?.networkId, item.address),
                  })
                }
                subtitle={tinyAddress(item.address, 21)}
                titleStyle={{ color: secondaryColor }}
              />
            )}
            ListHeaderComponent={() => (
              <GetStartedOption
                variant="small"
                title="Create new"
                icon={postJobSVG}
                isBetaVersion
                disabled={!authToken}
                onPress={() => navigation.navigate("MultisigCreate")}
              />
            )}
            ListFooterComponent={() =>
              isMultisigLoading && isMultisigFetching ? (
                <View style={contentCenterCStyle}>
                  <ActivityIndicator color={secondaryColor} />
                </View>
              ) : null
            }
          />
        </View>
        <SpacerColumn size={3} />
        {!!invitations?.length && (
          <>
            <View>
              <BrandText style={fontRegular28}>Invitations</BrandText>
              <SpacerColumn size={1.5} />
              <BrandText style={[fontRegular16, { color: neutral77 }]}>
                Multisignatures Wallets you did not join yet
              </BrandText>
              <SpacerColumn size={2.5} />
              <FlatList
                data={invitations}
                horizontal
                keyExtractor={(item) => item.address}
                renderItem={({ item, index }) => (
                  <AnimationFadeIn delay={index * 50}>
                    <GetStartedOption
                      variant="small"
                      title={
                        item.name ||
                        `Multisig #${(invitations?.length || 0) - index}`
                      }
                      icon={multisigWalletSVG}
                      isBetaVersion
                      onPress={() =>
                        navigation.navigate("MultisigWalletDashboard", {
                          id: getUserId(
                            selectedWallet?.networkId,
                            item.address,
                          ),
                        })
                      }
                      subtitle={tinyAddress(item.address, 21)}
                      titleStyle={{ color: secondaryColor }}
                    />
                  </AnimationFadeIn>
                )}
                ListFooterComponent={() =>
                  isMultisigLoading && isMultisigFetching ? (
                    <View style={contentCenterCStyle}>
                      <ActivityIndicator color={secondaryColor} />
                    </View>
                  ) : null
                }
              />
            </View>
            <SpacerColumn size={3} />
          </>
        )}
      </>
    );
  }, [
    authToken,
    data,
    invitations,
    isMultisigFetching,
    isMultisigLoading,
    navigation,
    selectedWallet?.networkId,
    selectedWallet?.userId,
  ]);

  return (
    <ScreenContainer
      headerChildren={<ScreenTitle>Multisig Wallets</ScreenTitle>}
      isLarge
      noScroll
      footerChildren={<></>}
    >
      <View style={containerCStyle}>
        <MultisigTransactions
          Header={Header}
          title="Multisig Transactions Overview"
          userId={selectedWallet?.userId}
          networkId={selectedWallet?.networkId}
        />
      </View>
    </ScreenContainer>
  );
};

const containerCStyle: ViewStyle = {
  flex: 1,
  paddingTop: layout.topContentSpacingWithHeading,
};

const contentCenterCStyle: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  width: 135,
};
