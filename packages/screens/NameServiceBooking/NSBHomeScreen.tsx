import {FlowCard} from "../../components/cards/FlowCard"

{/*TODO: STEP3*/}


import React, {useState} from "react"

import { ScreenContainer } from "../../components/ScreenContainer";
import {WalletSelector} from '../../components/WalletSelector'
import {useAppNavigation} from '../../utils/navigation'
import {WalletsManager} from '../../components/WalletsManager'
import {Header} from "../../components/Header"
import {TextInput, View} from "react-native"
import {Sidebar} from "../../components/Sidebar"
import {NSBIntro} from "../../components/NameServiceBooking/NSBIntro"
import {NSBLanding} from "../../components/NameServiceBooking/NSBLanding"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {SocialNetworks} from "../../components/Footer"
import {IntroLogoText} from "../../components/IntroLogoText"
import registerIconPNG from "../../../assets/icons/register.png"
import manageIconPNG from "../../../assets/icons/manage.png"
import exploreIconPNG from "../../../assets/icons/explore.png"
import ModalBase from "../../components/modals/ModalBase"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"

// "Find a name" modal
const ModalNameFinder: React.FC<{
		visible?: boolean;
		onClose: () => void;
}> = ({visible, onClose}) => {

		return (
				<ModalBase visible={visible} onClose={onClose} label="Find a name" width={372}>
						<TextInputCustom label="name" placeHolder="Type name here"/>
				</ModalBase>
		)
}

export const NSBHomeScreen: React.FC = () => {
		const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);

		const navigation = useAppNavigation();
		const landingHorizontalPadding = 25;

		return (
				<ScreenContainer2 footerChildren={<SocialNetworks/>}>
						{/*<NSBIntro nsbPage="Home"/>*/}
						<IntroLogoText subTitle="Name Service Booking"/>
						{/*<NSBLanding/>*/}
						<View
								style={{
										marginHorizontal: "auto",
										marginTop: 40,
										paddingHorizontal: landingHorizontalPadding
								}}
						>

								<FlowCard label="Register" description="Register and configure a new name" iconSource={registerIconPNG}/>
								<FlowCard label="Manage" description="Transfer, edit, or burn a name that you own" iconSource={manageIconPNG}/>
								<FlowCard
										label="Explore" description="Lookup addresses and explore registered names"
										iconSource={exploreIconPNG}
										// onPress={() => navigation.navigate("NSBExplore")}
										onPress={() => {
												console.log('???????', modalNameFinderVisible)
												return setModalNameFinderVisible(true)
										}}
								/>
						</View>

					<ModalNameFinder visible={modalNameFinderVisible} onClose={() => setModalNameFinderVisible(false)}/>

				</ScreenContainer2>
		);
};
