import {ScreenContainer2} from "../../components/ScreenContainer2"

{/*TODO: STEP3*/}

import React, {useContext} from "react"

import {BrandText} from "../../components/BrandText"
import {Image, TouchableOpacity, View, ViewStyle} from "react-native"
import flowCardPNG from "../../../assets/cards/flow-card.png"
import logoSmPNG from "../../../assets/logo-sm.png"
import {PrimaryPill} from "../../components/pills/PrimaryPill"
import {NSBContext} from "../../context/NSBProvider"
import {useAppNavigation} from "../../utils/navigation"
import {BacKTo} from "../../components/Footer"

const NameCard: React.FC <{
		fullName: string;
		isPrimary?: boolean;
		style: ViewStyle;
		onPress: () => void;
}> = ({fullName, isPrimary, style,	onPress}) => {
		const innerHeight = 44

		return (
				<TouchableOpacity style={style} onPress={onPress}>
						<Image
								source={flowCardPNG}
								style={{width: 392, height: 84, resizeMode: "stretch"}}
						/>

						<View style={{
								flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
								position: 'absolute',
								height: innerHeight, width: "100%",
								top: `calc(50% - ${innerHeight}px / 2)`
						}}>
								<View style={{flex: 1, flexDirection: "row", alignItems: "center"}}>
										<Image
												source={logoSmPNG}
												style={{
														width: 44,
														height: 44,
														resizeMode: "stretch",
														marginLeft: 20,
														marginRight: 12
												}}
										/>
										<BrandText style={{letterSpacing: -(20 * 0.04)}}> {fullName} </BrandText>
								</View>

								{isPrimary ? <PrimaryPill label={"Primary"} style={{marginRight: 20}}/> : null}
						</View>
				</TouchableOpacity>
		)
}

export const NSBManageScreen: React.FC = () => {
		const {setName, setSignedUserIsOwner} = useContext(NSBContext)
		const navigation = useAppNavigation()
		const titleFontSize = 48
		const subTitleFontSize = 28

		const names = [
				{fullName: "sdnfiodngsd", isPrimary: true},
				{fullName: "sgezgezgz", isPrimary: false},
				{fullName: "btehrfazf", isPrimary: false},
				{fullName: "azfegzbe", isPrimary: false},
		]

		const onPressNameCard = name => {
				setName(name.fullName)
				setSignedUserIsOwner(true)
				navigation.navigate("NSBConsultName")
		}

		return (
				<ScreenContainer2 footerChildren={<BacKTo label="home" navItem="NSBHome"/>}>
						<View style={{flex: 1, alignItems: "center"}}>
								{/*TODO: Gradient text green-blue*/}
								<BrandText
										style={{fontSize: titleFontSize, lineHeight: 64, letterSpacing: -(titleFontSize * 0.04), marginTop: 32}}
								>
										Welcome back, Test !
								</BrandText>
								{/*TODO: Gradient text green-blue*/}
								<BrandText
										style={{fontSize: subTitleFontSize, lineHeight: 32, letterSpacing: -(subTitleFontSize * 0.04), marginBottom: 20, marginTop: 8}}
								>
										Manage your names
								</BrandText>

								{names.map(name => (
										<NameCard
												fullName={name.fullName} key={name.fullName}
												style={{marginTop: 20}}
												isPrimary={name.isPrimary}
												onPress={() => onPressNameCard(name)}
										/>
								))}
						</View>
				</ScreenContainer2>
		);
};
