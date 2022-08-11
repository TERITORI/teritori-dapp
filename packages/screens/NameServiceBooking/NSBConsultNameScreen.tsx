import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import { NameAndTldText } from "../../components/nameService/NameAndTldText";
import { NameNFT } from "../../components/nameService/NameNFT";
import { DarkButton } from "../../components/buttons/DarkButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { CopyToClipboardCard } from "../../components/cards/CopyToClipboardCard";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { NSBContext } from "../../context/NSBProvider";
import { useToken, useTokenList } from "../../hooks/tokens";
import { useStore } from "../../store/cosmwasm";
import { neutral33, neutral44, neutral77 } from "../../utils/colors";
import {
  isTokenOwned,
  numberWithThousandsSeparator,
} from "../../utils/handefulFunctions";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import {
  imageDisplayLabel,
  prettyTokenData,
  publicNameDisplayLabel,
} from "../../utils/teritori";
import {FeedbacksContext} from "../../context/FeedbacksProvider"
import {ScreenContainer} from "../../components/ScreenContainer"
import {BackTo} from "../../components/navigation/BackTo"

const SendFundModal: React.FC<{
  onClose: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  const [comment, setComment] = useState("Sent from Teritori");
  const [amount, setAmount] = useState("1000");
  const [_visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(visible);
  }, [visible]);

  return (
    <ModalBase
      visible={_visible}
      onClose={onClose}
      width={372}
      label={`Your wallet has ${numberWithThousandsSeparator(1000)} Tori`}
      childrenBottom={
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ borderBottomWidth: 1, borderColor: neutral44 }} />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 20,
            }}
          >
            <BackTo
              label="Back to search"
              navItem="NSBRegister"
              onPress={() => setVisible(false)}
            />
            {/*<DarkButton text={"Show paths"} style={{width: "fit-content"}}/>*/}
          </View>
        </View>
      }
    >
      <View>
        <TextInputCustom
          label="COMMENT ?"
          value={comment}
          placeHolder="Type your comment here"
          onChangeText={setComment}
          style={{ marginBottom: 12 }}
        />
        <View style={{ flex: 1, flexDirection: "row" }}>
          <TextInputCustom
            label="TORI AMOUNT ?"
            value={numberWithThousandsSeparator(amount)}
            placeHolder="Type your amount here"
            onChangeText={setAmount}
            onlyNumbers
            style={{ marginRight: 12, minWidth: 0 }}
          />
          <PrimaryButton text="Send" style={{ width: "fit-content" }} />
        </View>
      </View>
    </ModalBase>
  );
};

const NotOwnerActions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const btnStyle = { marginLeft: 24, width: "fit-content" };
  return (
    <>
      <BackTo label="Back to search" navItem="NSBRegister" />
      <PrimaryButton
        text="Send funds"
        style={btnStyle}
        onPress={() => setModalVisible(true)}
      />
      {/*<DarkButton text="Show paths" style={btnStyle}/>*/}
      <SendFundModal
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
      />
    </>
  );
};

const OwnerActions = () => {
  const navigation = useAppNavigation();
  const { name } = useContext(NSBContext);
  const btnStyle = { marginLeft: 24, width: "fit-content" };
  return (
    <>
      <BackTo navItem="NSBManage" label="Back"/>
      <DarkButton
        text="Update metadata"
        style={btnStyle}
        onPress={() => navigation.navigate("NSBUpdateName", { name })}
      />
      {/*<DarkButton*/}
      {/*  text="Transfer"*/}
      {/*  style={btnStyle}*/}
      {/* onPress={() => {}}*/}
      {/*/>*/}
      {/*<DarkButton*/}
      {/*  text="Mint path"*/}
      {/*  style={btnStyle}*/}
      {/*  onPress={() => navigation.navigate("NSBMintPath", { name })}*/}
      {/*/>*/}
      <DarkButton
        text="Burn"
        style={btnStyle}
        onPress={() => navigation.navigate("NSBBurnName", { name })}
      />
    </>
  );
};

export const NSBConsultNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBConsultName">;
}> = ({ route }) => {
  const { name, setName } = useContext(NSBContext);
  const { setLoadingFullScreen } = useContext(FeedbacksContext);
  const { token, notFound, loadingToken } = useToken(name, process.env.TLD);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const navigation = useAppNavigation();

  // Sync loadingFullScreen
  useEffect(() => {
    setLoadingFullScreen(loadingToken);
  }, [loadingToken]);
  useEffect(() => {
    setLoadingFullScreen(loadingTokens);
  }, [loadingTokens]);

  // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the token is not minted
  useFocusEffect(() => {
    // @ts-ignore
    if (route.params && route.params.name) setName(route.params.name);
    if (!signingClient) navigation.navigate("NSBHome");
  });

  return (
    <ScreenContainer hideSidebar headerStyle={{borderBottomColor: "transparent"}}
      footerChildren={
        isTokenOwned(tokens, name) && !notFound ? (
          <OwnerActions />
        ) : !notFound ? (
          <NotOwnerActions />
        ) : (
          <BackTo navItem="NSBHome" label="Back to home" />
        )
      }
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 32,
        }}
      >
        {notFound ? (
          <BrandText>Not found</BrandText>
        ) : (
          <>
            <View
              style={{ flex: 1, marginRight: 20, width: "100%", maxWidth: 332 }}
            >
              <NameNFT style={{ marginBottom: 20 }} name={name} />
              {token && name && isTokenOwned(tokens, name) ? (
                <CopyToClipboardCard
                  text={`https://${window.location.host}/nsb/${name}`}
                />
              ) : token && name && !isTokenOwned(tokens, name) ? (
                <CopyToClipboardCard text={token.contract_address} />
              ) : null}
            </View>

            <View
              style={{
                flex: 1,
                borderColor: neutral33,
                borderWidth: 1,
                borderRadius: 8,
                width: "100%",
                maxWidth: 396,
                height: "fit-content",
                padding: 24,
                // Remove the marginBottom of the last tokenData
                paddingBottom: -8,
              }}
            >
              {token ? (
                <>
                  <View style={{ flex: 1, marginBottom: 32 }}>
                    <BrandText
                      style={{
                        fontSize: 16,
                        marginBottom: 8,
                        color: neutral77,
                      }}
                    >
                      Name
                    </BrandText>
                    <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
                      {name}
                    </BrandText>
                  </View>

                  {prettyTokenData(token)
                    // We display only the raw if there is a value
                    .filter((data) => data.value)
                    .map((data, i) => (
                      <View style={{ flex: 1, marginBottom: 32 }} key={i}>
                        <BrandText
                          style={{
                            fontSize: 16,
                            marginBottom: 8,
                            color: neutral77,
                          }}
                        >
                          {data.displayLabel}
                        </BrandText>
                        {/*---- We want some style depending on the data type*/}
                        {data.displayLabel === publicNameDisplayLabel ? (
                          <NameAndTldText nameAndTldStr={data.value} />
                        ) : data.displayLabel === imageDisplayLabel ? (
                          // TODO: Gradient text blue-green
                          <ExternalLink
                            externalUrl={data.value}
                            style={{ letterSpacing: -(20 * 0.04) }}
                            numberOfLines={1}
                          >
                            {data.value}
                          </ExternalLink>
                        ) : (
                          <BrandText style={{ letterSpacing: -(20 * 0.04) }}>
                            {data.value}
                          </BrandText>
                        )}
                      </View>
                    ))}
                </>
              ) : (
                <BrandText>Loading</BrandText>
              )}
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
};
