import { RouteProp, useFocusEffect } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import { BacKTo } from "../../components/Footer";
import { NameAndTldText } from "../../components/TeritoriNameService/NameAndTldText";
import { NameNFT } from "../../components/TeritoriNameService/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { DarkButton } from "../../components/buttons/DarkButton";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { CopyToClipboardCard } from "../../components/cards/CopyToClipboardCard";
import { TextInputCustom } from "../../components/inputs/TextInputCustom";
import ModalBase from "../../components/modals/ModalBase";
import { TNSContext } from "../../context/TNSProvider";
import { useToken, useTokenList } from "../../hooks/tokens";
import { useStore } from "../../store/cosmwasm";
import { neutral33, neutral44, neutral77 } from "../../utils/style/colors";
import {
  isTokenOwned,
} from "../../utils/tns";
import {
  numberWithThousandsSeparator,
} from "../../utils/numbers";
import { RootStackParamList, useAppNavigation } from "../../utils/navigation";
import {
  imageDisplayLabel,
  prettyTokenData,
  publicNameDisplayLabel,
} from "../../utils/teritori";

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
            <BacKTo
              label="search"
              navItem="TNSRegister"
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
      <BacKTo label="search" navItem="TNSRegister" />
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
  const { name } = useContext(TNSContext);
  const btnStyle = { marginLeft: 24, width: "fit-content" };
  return (
    <>
      <BacKTo navItem="TNSManage" />
      <DarkButton
        text="Update metadata"
        style={btnStyle}
        onPress={() => navigation.navigate("TNSUpdateName", { name })}
      />
      {/*<DarkButton*/}
      {/*  text="Transfer"*/}
      {/*  style={btnStyle}*/}
      {/* onPress={() => {}}*/}
      {/*/>*/}
      {/*<DarkButton*/}
      {/*  text="Mint path"*/}
      {/*  style={btnStyle}*/}
      {/*  onPress={() => navigation.navigate("TNSMintPath", { name })}*/}
      {/*/>*/}
      <DarkButton
        text="Burn"
        style={btnStyle}
        onPress={() => navigation.navigate("TNSBurnName", { name })}
      />
    </>
  );
};

export const TNSConsultNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "TNSConsultName">;
}> = ({ route }) => {
  const { name, setName, setTnsLoading } = useContext(TNSContext);
  const { token, notFound, loadingToken } = useToken(name, process.env.TLD);
  const { tokens, loadingTokens } = useTokenList();
  const signingClient = useStore((state) => state.signingClient);
  const navigation = useAppNavigation();

  // Sync tnsLoading
  useEffect(() => {
    setTnsLoading(loadingToken);
  }, [loadingToken]);
  useEffect(() => {
    setTnsLoading(loadingTokens);
  }, [loadingTokens]);

  // ---- Setting the name from TNSContext. Redirects to TNSHome if this screen is called when the token is not minted
  useFocusEffect(() => {
    // @ts-expect-error
    if (route.params && route.params.name) setName(route.params.name);
    if (!signingClient) navigation.navigate("TNSHome");
  });

  return (
    <ScreenContainer2
      footerChildren={
        isTokenOwned(tokens, name) && !notFound ? (
          <OwnerActions />
        ) : !notFound ? (
          <NotOwnerActions />
        ) : (
          <BacKTo navItem="TNSHome" label="home" />
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
                  text={`https://${window.location.host}/tns/${name}`}
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
    </ScreenContainer2>
  );
};
