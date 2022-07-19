import {FlowCard} from "../../components/cards/FlowCard"

{/*TODO: STEP3*/}

import React, {useState} from "react"

import {useAppNavigation} from '../../utils/navigation'
import { View, StyleSheet} from "react-native"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {SocialNetworks} from "../../components/Footer"
import {IntroLogoText} from "../../components/IntroLogoText"
import registerIconPNG from "../../../assets/icons/register.png"
import manageIconPNG from "../../../assets/icons/manage.png"
import exploreIconPNG from "../../../assets/icons/explore.png"
import ModalBase from "../../components/modals/ModalBase"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"
import {errorColor, neutral22, neutral33, neutral77, successColor} from "../../utils/colors"
import {BrandText} from "../../components/BrandText"
import {domainsList} from "../../utils/teritori"

const DomainsAvailability: React.FC = () => {
		const s = StyleSheet.create({
				labelStyle: {
						fontSize: 14, color: neutral77, marginBottom: 8
				},
				domainStyle: {
						fontSize: 16, color: neutral77, marginRight: 16
				},
				domainsContainerStyle: {
						flex: 1, flexDirection: "row", alignItems: "center", width: "100%"
				}
		})

		//TODO: Set minted domains from domainsList and map() it is JSX

		return (
				<View 	style={{
						backgroundColor: "#000000",
						borderWidth: 1, borderColor: neutral33,	borderRadius: 8,
						width: "100%", height: 160,
						flex: 1, flexDirection: "column", justifyContent: "space-between",
						paddingVertical: 24, paddingHorizontal: 20
				}}>
						<BrandText style={s.labelStyle}>Available domains:</BrandText>
						{/* ---- Domains that exist (With status minted or not) */}
						<View style={s.domainsContainerStyle}>
								{domainsList.filter(domain => !domain.comingSoon).map(domain => (
										<BrandText style={[s.domainStyle, {color: domain.minted ? errorColor : successColor}]}>
												{domain.name}
										</BrandText>
								))}
						</View>
						<BrandText style={[s.labelStyle, {marginTop: 24}]}>Coming soon domains:</BrandText>
						{/* ---- Domains that not exist */}
						<View style={s.domainsContainerStyle}>
								{domainsList.filter(domain => domain.comingSoon).map(domain => (
										<BrandText style={s.domainStyle}>
												{domain.name}
										</BrandText>
								))}
						</View>
				</View>
		)
}

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
				<ModalBase
						visible={visible} onClose={onClose} label="Find a name"
						childrenBottom={<DomainsAvailability/>}
				>
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
