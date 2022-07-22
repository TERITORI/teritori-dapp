import * as R from "ramda";
import React, { useContext, useEffect } from "react";
import { Image, View } from "react-native";

import longCardPNG from "../../../assets/cards/long-card.png";
import coinPNG from "../../../assets/icons/coin.png";
import { BrandText } from "../../components/BrandText";
import { BacKTo } from "../../components/Footer";
import { NameDataForm } from "../../components/NameServiceBooking/NameDataForm";
import { NameNFT } from "../../components/NameServiceBooking/NameNFT";
import { ScreenContainer2 } from "../../components/ScreenContainer2";
import { NSBContext } from "../../context/NSBProvider";
import { useSigningClient } from "../../context/cosmwasm";
import { useSigningCosmWasmClient } from "../../hooks/cosmwasm";
import { useStore } from "../../store/cosmwasm";
import { defaultMintFee, getMintCost } from "../../utils/fee";
import { defaultMemo } from "../../utils/memo";
import { useAppNavigation } from "../../utils/navigation";

const CostContainer: React.FC = () => {
  const innerHeight = 32;

  return (
    <View>
      <Image
        source={longCardPNG}
        style={{ width: 748, height: 80, resizeMode: "stretch" }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          height: innerHeight,
          top: `calc(50% - ${innerHeight}px / 2)`,
        }}
      >
        <Image
          source={coinPNG}
          style={{
            width: 32,
            height: 32,
            resizeMode: "stretch",
            marginLeft: 24,
            marginRight: 12,
          }}
        />

        {/*TODO: Dynamic value ?*/}
        <BrandText>The mint cost for this token is 1,000 Tori</BrandText>
      </View>
    </View>
  );
};

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBEditCreateNameScreen: React.FC = () => {
  const { name, setNsbError } = useContext(NSBContext);
  const navigation = useAppNavigation();

  // No entered name ? Go home
  useEffect(() => {
    if (!name) navigation.navigate("NSBHome");
  });

  const { signingClient, walletAddress } = useSigningClient();
  const { connectWallet } = useSigningCosmWasmClient();
  // ---- Init
  useEffect(() => {
    const initCosmWasm = async () => {
      await connectWallet();
    };
    initCosmWasm();
  }, []);

  const contractAddress = process.env.PUBLIC_WHOAMI_ADDRESS as string;
  const appendTokenId = useStore((state) => state.appendTokenId);
  const mintCost = getMintCost(name);

  const submitData = async (data) => {
    if (!signingClient || !walletAddress) {
      return;
    }
    // 		setLoading(true)  TODO: Loader everywhere
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
    } = data;

    const normalizedTokenId = R.toLower(name);
    const msg = {
      mint: {
        owner: walletAddress,
        token_id: normalizedTokenId,
        token_uri: null, // TODO - support later
        extension: {
          image,
          image_data: null, // TODO - support later
          email,
          external_url,
          public_name: name,
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
      const mintedToken = await signingClient.execute(
        walletAddress!,
        contractAddress,
        msg,
        defaultMintFee,
        defaultMemo,
        mintCost
      );
      if (mintedToken) {
        appendTokenId(name);
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
    //TODO: If the user is owner : BacKTo label="{name}" navItem="NSBConsult"/>
    //If the user is not the owner : BacKTo label="search" navItem="NSBRegister"/>
    <ScreenContainer2
      footerChildren={<BacKTo label="search" navItem="NSBRegister" />}
    >
      <View style={{ flex: 1, alignItems: "center", marginTop: 32 }}>
        {/*TODO: If the user is not the owner : tokens[] <== "Is the entered name in these tokens ?" */}
        <CostContainer />
        {/*///////*/}

        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <NameNFT style={{ marginRight: 20 }} name={name} />
          {/*///////*/}

          <NameDataForm btnLabel="Create username" onPressBtn={submitData} />
        </View>
      </View>
    </ScreenContainer2>
  );
};
