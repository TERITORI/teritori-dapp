import {Logo} from "../svgs/Logo"

{/*TODO: STEP3*/}

import React from "react";
import { View, Image, ViewStyle, TouchableOpacity } from "react-native";
import {BrandText} from "../BrandText"
import {IntroLogoText} from "../IntroLogoText"

// import connectedImagePNG from "../../assets/connected-image-bad.png";
// import { getCurrentRouteName, useAppNavigation } from "../utils/navigation";
// import { WalletProvider } from "../utils/walletProvider";
// import { BalanceCard } from "./BalanceCard";
// import { BrandText } from "./BrandText";
// import { useSolanaBalance } from "./SolanaBalanceProvider/solanaBalanceContext";
// import { useTeritoriBalance } from "./TeritoriBalanceProvider";
// import { WalletSelector } from "./WalletSelector";
// import { useWallets } from "./WalletsProvider";
// import { PrimaryButton } from "./buttons/PrimaryButton";
// import { Logo } from "./svgs/Logo";

export type NSBPageName = "Home" | "Register" | "Manage" | "Explore";

export const NSBIntro: React.FC<{
		nsbPage: NSBPageName;
}> = ({ nsbPage }) => {

		const introHeight = 273

		return(
				<View style={{height: introHeight}}>
						{/*<Logo/>*/}
						{/*<BrandText style={{ color: "#00C6FB", marginTop: 17, fontSize: 16 }}>*/}
						{/*		Welcome to Teritori_*/}
						{/*</BrandText>*/}

						<IntroLogoText subTitle="Name Service Booking"/>

				</View>


		)

		// const { wallets } = useWallets();

		// if (
		// 		wallets.filter(
		// 				(wallet) => wallet.connected || wallet.provider === WalletProvider.Store
		// 		).length > 0
		// ) {
		// 		return <ConnectedIntro />;
		// }
		// return <DisconnectedIntro />;


};
