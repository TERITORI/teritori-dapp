import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { Image, View } from "react-native";

import longCardPNG from "../../../assets/cards/long-card.png";
import coinPNG from "../../../assets/icons/coin.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { NameDataForm } from "../../components/NameServiceBooking/NameDataForm";
import { NameNFT } from "../../components/NameServiceBooking/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { NSBContext } from "../../context/NSBProvider";
import { useSigningClient } from "../../context/cosmwasm";
import { useSigningCosmWasmClient } from "../../hooks/cosmwasm";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import { defaultMemo } from "../../utils/memo";
import {RootStackParamList, useAppNavigation} from "../../utils/navigation"
import { OptionString } from "../../utils/types/base";
import { defaultMetaData, Metadata } from "../../utils/types/messages";
import {useHasUserConnectedWallet} from "../../hooks/useHasUserConnectedWallet"
import {RouteProp, useFocusEffect} from "@react-navigation/native"
import {useTokenList} from "../../hooks/tokens"
import {isTokenOwned} from "../../utils/handefulFunctions"

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBUpdateNameScreen: React.FC<{
  route: RouteProp<RootStackParamList, "NSBUpdateName">
}> = ({route}) => {
  const [initialData, setInitialData] = useState(defaultMetaData);
  const { name, setName, setNsbError, setNsbSuccess } = useContext(NSBContext);
  const navigation = useAppNavigation();
  const { signingClient, walletAddress } = useSigningClient();
  const { connectWallet } = useSigningCosmWasmClient();
  const userHasCoWallet = useHasUserConnectedWallet();
  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const appendTokenId = useStore((state) => state.appendTokenId);
  const mintCost = getMintCost(name);
  const { tokens } = useTokenList();

  // ==== Init
  useFocusEffect(() => {
    // ---- Setting the name from NSBContext. Redirects to NSBHome if this screen is called when the user doesn't own the token.

    // @ts-ignore
    if(route.params && route.params.name) setName(route.params.name)
    // ===== Controls many things, be careful
    if (name && tokens.length && (!userHasCoWallet || !isTokenOwned(tokens, name)) || !signingClient) {
      navigation.navigate("NSBHome");
    }

    const init = async () => {
      // await connectWallet();
      try {
        // If this query fails it means that the token does not exist.
        const token = await signingClient.queryContractSmart(contractAddress, {
          nft_info: {
            token_id: name + process.env.TLD,
          },
        });
        // return token.extension;
        const tokenData: Metadata = {
          image: token.extension.image,
          image_data: token.extension.image_data,
          email: token.extension.email,
          external_url: token.extension.external_url,
          public_name: token.extension.public_name,
          public_bio: token.extension.public_bio,
          twitter_id: token.extension.twitter_id,
          discord_id: token.extension.discord_id,
          telegram_id: token.extension.telegram_id,
          keybase_id: token.extension.keybase_id,
          validator_operator_address:
          token.extension.validator_operator_address,
        };
        setInitialData(tokenData);
      } catch (e) {
        // ---- If here, "cannot contract", so the token is considered as available
        // return undefined;
      }
    };

    init();
  });

  const submitData = async (_data) => {

    if (!signingClient || !walletAddress) {
      return;
    }
    // 		setLoading(true)  TODO: Loader, loader everywhere
    const {
      image, // TODO - support later
      // image_data
      email,
      external_url,
      // public_name, // Useless because NSBContext ?
      public_bio,
      twitter_id,
      discord_id,
      telegram_id,
      keybase_id,
      validator_operator_address,
    } = _data;

    const normalizedTokenId = R.toLower(name + process.env.TLD);

    const msg = {
      update_metadata: {
        token_id: normalizedTokenId,
        metadata: {
          image,
          image_data: null, // TODO - support later
          email,
          external_url,
          public_name: name + process.env.TLD,
          public_bio,
          twitter_id,
          discord_id,
          telegram_id,
          keybase_id,
          validator_operator_address,
        },
      },
    };

    try {
      const updatedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo
      );
      if (updatedToken) {
        console.log(normalizedTokenId + " successfully updated"); //TODO: redirect to the token
        setNsbSuccess({
          title: normalizedTokenId + " successfully updated",
          message: "",
        });
        navigation.navigate("NSBManage")
        // setLoading(false)
      }
    } catch (err) {
      setNsbError({
        title: "Something went wrong!",
        message: err.message,
      });
      console.warn(err);
      // setLoading(false)
    }
  };

  return (
    <ScreenContainer2
      footerChildren={<BacKTo label={name} navItem="NSBConsultName" navParams={{name}}/>}>
      <View style={{ flex: 1, alignItems: "center", marginTop: 32 }}>

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <NameNFT style={{ marginRight: 20 }} name={name} />

          <NameDataForm
            btnLabel={"Update profile"}
            onPressBtn={submitData}
            initialData={initialData}
          />
        </View>
      </View>
    </ScreenContainer2>
  );
};
