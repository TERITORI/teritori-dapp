import {FlowCard} from "../../components/cards/FlowCard"

{/*TODO: STEP3*/}

import React, {useState} from "react"

import {useAppNavigation} from '../../utils/navigation'
import { View} from "react-native"
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
		const [name, setName] = useState("")
		const navigation = useAppNavigation();

		const onPressEnter = () => {
				setName("")
				onClose()
				// @ts-ignore TODO: fix ? (Remove @ts-ignore)
				navigation.navigate("NSBExplore", {	name })
		}

		return (
				<ModalBase visible={visible} onClose={onClose} label="Find a name">
						{/*TODO: Uncomment and fix  */}
						<TextInputCustom label="name" placeHolder="Type name here" onPressEnter={onPressEnter} onChangeText={setName} value={name}/>
				</ModalBase>
		)
}

export const NSBHomeScreen: React.FC = () => {
		const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
		const landingHorizontalPadding = 25;

		return (
				<ScreenContainer2 footerChildren={<SocialNetworks/>}>
						<IntroLogoText subTitle="Name Service Booking"/>
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
										onPress={() => setModalNameFinderVisible(true)}
								/>
						</View>

					<ModalNameFinder visible={modalNameFinderVisible} onClose={() => setModalNameFinderVisible(false)}/>

				</ScreenContainer2>
		);
};
