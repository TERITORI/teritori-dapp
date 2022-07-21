import {FlowCard} from "../../components/cards/FlowCard"

{/*TODO: STEP3*/}

import React, {useContext, useEffect, useState} from "react"

import {RootStackParamList, useAppNavigation} from "../../utils/navigation"
import { View, StyleSheet} from "react-native"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {SocialNetworks} from "../../components/Footer"
import {IntroLogoText} from "../../components/IntroLogoText"
import registerIconPNG from "../../../assets/icons/register.png"
import manageIconPNG from "../../../assets/icons/manage.png"
import exploreIconPNG from "../../../assets/icons/explore.png"
import ModalBase from "../../components/modals/ModalBase"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"
import {errorColor, neutral23, neutral33, neutral77, successColor} from "../../utils/colors"
import {BrandText} from "../../components/BrandText"
import {domainsList} from "../../utils/teritori"
import {NSBContext} from "../../context/NSBProvider"

// Just a container that it can be added at the bottom of the modal
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
						flex: 1, justifyContent: "space-between",
						paddingVertical: 24, paddingHorizontal: 20
				}}>
						<BrandText style={s.labelStyle}>Available domains:</BrandText>
						{/* ---- Domains that exist (With status minted or not) */}
						<View style={s.domainsContainerStyle}>
								{domainsList.filter(domain => !domain.comingSoon).map(domain => (
										<BrandText key={domain.name} style={[s.domainStyle, {color: domain.minted ? errorColor : successColor}]}>
												{domain.name}
										</BrandText>
								))}
						</View>
						<BrandText style={[s.labelStyle, {marginTop: 24}]}>Coming soon domains:</BrandText>
						{/* ---- Domains that not exist */}
						<View style={s.domainsContainerStyle}>
								{domainsList.filter(domain => domain.comingSoon).map(domain => (
										<BrandText key={domain.name} style={s.domainStyle}> {domain.name} </BrandText>
								))}
								<BrandText style={[s.domainStyle, {marginRight: 0}]}>and more</BrandText>
						</View>
				</View>
		)
}

// "Find a name" modal
const ModalNameFinder: React.FC<{
		visible?: boolean
		onClose: () => void
		navItem: keyof RootStackParamList
}> = ({visible, navItem, onClose}) => {
		const navigation = useAppNavigation();
		const {name, setName} = useContext(NSBContext)

		const onPressEnter = () => {
				if(name) {
						onClose()
						navigation.navigate(navItem)
				}
		}

		useEffect(() => {
				// Reset the name each time the modal appears
				if(visible) setName("")
		}, [visible])

		return (
				<ModalBase
						visible={visible} onClose={onClose} label="Find a name"
						// childrenBottom={<DomainsAvailability/>} TODO: Uncomment this when <DomainsAvailability/> is finished
				>
						<TextInputCustom label="NAME" placeHolder="Type name here" onPressEnter={onPressEnter} onChangeText={setName} value={name}/>
				</ModalBase>
		)
}

export const NSBHomeScreen: React.FC = () => {
		const [modalNameFinderVisible, setModalNameFinderVisible] = useState(false);
		const [pressedNavItem, setPressedNavItem] = useState<keyof RootStackParamList>("Home");
		const navigation = useAppNavigation();
		const landingHorizontalPadding = 25;

		const onPressRegister = () => {
				setPressedNavItem("NSBRegister")
				setModalNameFinderVisible(true)
		}
		const onPressManage = () => {
				navigation.navigate("NSBManage")
		}
		const onPressExplore = () => {
				setPressedNavItem("NSBExplore")
				setModalNameFinderVisible(true)
		}

		return (
				<ScreenContainer2 footerChildren={<SocialNetworks/>}>
						<IntroLogoText subTitle="Name Service Booking" style={{marginTop: 40}}/>
						<View
								style={{
										marginHorizontal: "auto",
										marginTop: 40,
										paddingHorizontal: landingHorizontalPadding
								}}
						>
								<FlowCard
										label="Register" description="Register and configure a new name"
										iconSource={registerIconPNG}
										onPress={onPressRegister}
								/>
								<FlowCard
										style={{marginTop: 20}}
										label="Manage" description="Transfer, edit, or burn a name that you own"
										iconSource={manageIconPNG}
										onPress={onPressManage}
								/>
								<FlowCard
										style={{marginTop: 20}}
										label="Explore" description="Lookup addresses and explore registered names"
										iconSource={exploreIconPNG}
										onPress={onPressExplore}
								/>
						</View>

					<ModalNameFinder
							visible={modalNameFinderVisible} onClose={() => setModalNameFinderVisible(false)}
							navItem={pressedNavItem}
					/>

				</ScreenContainer2>
		);
};
