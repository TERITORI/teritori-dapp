import logoTopPNG from "../../assets/logo-top.png"

{/*TODO: STEP3*/}

import React, {useCallback, useEffect, useState} from "react"
import {
  View,
  Image,
  TouchableOpacity, ImageSourcePropType, ViewStyle, ImageStyle
} from "react-native"

import {useAppNavigation } from "../utils/navigation";
import {headerHeight} from "../utils/layout"
import {WalletSelector} from "./WalletSelector"
import {PrimaryButton} from "./buttons/PrimaryButton"
import {SecondaryButton} from "./buttons/SecondaryButton"
import flowCardPNG from "../../assets/cards/flow-card.png"
import secondaryCardSmPNG from "../../assets/cards/secondary-card-sm.png"
import {BrandText} from "./BrandText"
import {useSigningClient} from "../context/cosmwasm"
import {useStore} from "../store/cosmwasm"
import {getNonSigningClient} from "../hooks/cosmwasm"
import {WalletsManager} from "./WalletsManager"


// Displayed when no wallet connected. Press to connect wallet
const ConnectWalletButton: React.FC<{
  style?: ViewStyle;
  onPress: () => void;
}> = ({style, onPress}) => {
  const height = 40

  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Image
        source={secondaryCardSmPNG}
        style={{width: 220, height, resizeMode: "stretch"}}
      />

      <View style={{
        flex: 1, alignItems: "center", justifyContent: "center",
        position: "absolute",
        height, width: "100%",
        top: `calc(50% - ${height}px / 2)`
      }}>
        <BrandText
          style={{
            fontSize: 14
          }}
        >
          Connect wallet
        </BrandText>
      </View>
    </TouchableOpacity>
  )
}

{/*TODO: Is it a good name for this cpt ?*/}
export const Header: React.FC = () => {
  const [walletsManagerVisible, setWalletsManagerVisible] = useState(false)
  const navigation = useAppNavigation();
  const headerMarginH = 22




  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // TODO: Connect wallet
  // const router = useRouter()
  // const contract = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
  // const [loading, setLoading] = useState(false)
  //
  // const walletAddress = useStore((state) => state.walletAddress)
  // const alias = useStore((state) => state.primaryAlias)
  // const setAlias = useStore((state) => state.setPrimaryAlias)
  // const setNonSigningClient = useStore((state) => state.setNonSigningClient)
  // const { connectWallet, disconnect, signingClient } = useSigningClient()
  // const handleConnect = () => {
  //   if (!walletAddress || walletAddress.length === 0) {
  //     connectWallet()
  //   } else {
  //     disconnect()
  //     setAlias(null)
  //   }
  // }
  // const PUBLIC_SITE_ICON_URL = process.env.NEXT_PUBLIC_SITE_ICON_URL || ''
  // const reconnect = useCallback(() => {
  //   disconnect()
  //   setAlias(null)
  //   connectWallet()
  // }, [disconnect, connectWallet, setAlias])
  //
  // // on first load, init the non signing client
  // useEffect(() => {
  //   const initNonSigningClient = async () => {
  //     const nonSigningClient = await getNonSigningClient()
  //     setNonSigningClient(nonSigningClient)
  //   }
  //
  //   initNonSigningClient()
  // }, [setNonSigningClient])
  //
  // useEffect(() => {
  //   window.addEventListener('keplr_keystorechange', reconnect)
  //
  //   return () => {
  //     window.removeEventListener('keplr_keystorechange', reconnect)
  //   }
  // }, [reconnect])
  //
  // useEffect(() => {
  //   if (!signingClient || !walletAddress) {
  //     return
  //   }
  //
  //   const getAlias = async () => {
  //     setLoading(true)
  //     try {
  //       let aliasResponse = await signingClient.queryContractSmart(contract, {
  //         primary_alias: {
  //           address: walletAddress,
  //         },
  //       })
  //       setAlias(aliasResponse.username)
  //       setLoading(false)
  //     } catch (e) {
  //       setLoading(false)
  //       setAlias(null)
  //       // console.log(e)
  //       return
  //     }
  //   }
  //
  //   getAlias()
  // }, [alias, walletAddress, contract, signingClient, setAlias])


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <View
      style={{
        height: headerHeight, maxHeight: headerHeight,
        width: "100%",
        flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Image
          source={logoTopPNG}
          style={{
            width: 68,
            height: 68,
            resizeMode: "contain",
            marginLeft: headerMarginH
          }}
        />
      </TouchableOpacity>

      {/*<SecondaryButton*/}
      {/*  text="Connect Wallet"*/}
      {/*  onPress={() => navigation.navigate("Mint")}*/}
      {/*/>*/}

      <ConnectWalletButton style={{ marginRight: headerMarginH}} onPress={() => setWalletsManagerVisible(true)}/>


      <WalletsManager visible={walletsManagerVisible} onClose={() => setWalletsManagerVisible(false)}/>

    </View>
  );
};
