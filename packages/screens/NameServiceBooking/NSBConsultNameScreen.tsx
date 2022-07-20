import {ScreenContainer2} from "../../components/ScreenContainer2"

{/*TODO: STEP3 => Here, you can consult a name. If the name is minted by you, the Footer wil contains other actions*/}

import React, {useContext, useEffect} from "react"

import { ComingSoon } from "../../components/ComingSoon";
import { ScreenContainer } from "../../components/ScreenContainer";
import {NameDataForm} from "../../components/NameServiceBooking/NameDataForm"
import {BacKTo} from "../../components/Footer"
import {PrimaryButton} from "../../components/buttons/PrimaryButton"
import {SecondaryButton} from "../../components/buttons/SecondaryButton"
import {NSBContext} from "../../context/NSBProvider"
import {useAppNavigation} from "../../utils/navigation"
import {useFocusEffect} from "@react-navigation/native"
import {TertiaryButton} from "../../components/buttons/TertiaryButton"
import {neutral30, neutral33, neutral77, primaryColor} from "../../utils/colors"
import {DarkButton} from "../../components/buttons/DarkButton"
import {View} from "react-native"
import {NameNFT} from "../../components/NameServiceBooking/NameNFT"
import {CopyToClipboardCard} from "../../components/cards/CopyToClipboardCard"
import {BrandText} from "../../components/BrandText"
import {dataTest} from "../../utils/types/nsb"
import {NameAndDomainText} from "../../components/NameServiceBooking/NameAndDomainText"
import {useCheckNameAvailability} from "../../hooks/useCheckNameAvailability"

const NotOwnerActions = () => {
		const btnStyle = {marginLeft: 24, width: "fit-content"}
		return (
				<>
						<BacKTo label="search" navItem="NSBRegister"/>
						<PrimaryButton text="Send funds" style={btnStyle}/>
						<DarkButton text="Show paths" style={btnStyle}/>
				</>
		)
}

const OwnerActions = () => {
		const btnStyle = {marginLeft: 24, width: "fit-content"}
		return (
				<>
						<BacKTo justBack/>
						<DarkButton text="Update metadata" style={btnStyle}/>
						<DarkButton text="Transfer" style={btnStyle}/>
						<DarkButton text="Mint path" style={btnStyle}/>
						<DarkButton text="Burn" style={btnStyle}/>
				</>
		)
}

// The visible name data (Necessarily minted). If the name is minted by the current user, other actions are provided in Footer
export const NSBConsultNameScreen: React.FC = () => {
		const {name, signedUserIsOwner} = useContext(NSBContext)
		const navigation = useAppNavigation()

		// ---- When this screen is called, if there is no entered name, we go NSBHome
		useFocusEffect(() => {
				if(!name) navigation.navigate("NSBHome")
		})

		return (
				<ScreenContainer2 footerChildren={signedUserIsOwner ? <OwnerActions/> : <NotOwnerActions/>}>
						<View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>
								<View style={{flex: 1, marginRight: 20, width: "100%", maxWidth: 332,}}>
										<NameNFT style={{marginBottom: 20}}/>
										{/*TODO: Dynamic value*/}
										<CopyToClipboardCard text="https://tetitori.io/teritori::test"/>
								</View>

								<View style={{
										flex: 1,
										borderColor: neutral33, borderWidth: 1, borderRadius: 8,
										width: "100%", maxWidth: 396, height: "fit-content",
										padding: 24,
								}}>
										{/*TODO: Dynamic values*/}
										{dataTest.filter(d => !!d.value).map(d => (
												<View style={{flex: 1, marginBottom: 32}} key={d.label}>
														<BrandText style={{fontSize: 16, marginBottom: 8, color: neutral77}}>{d.displayedLabel}</BrandText>
														{/*---- We want some style depending on the data type*/}
														{d.label === "publicName"
																? <NameAndDomainText nameAndDomainStr={d.value}/>
																: d.label === "imageUrl"

																		// TODO: Gradient text blue-green
																? <BrandText style={{color: primaryColor, letterSpacing: -(20 * 0.04)}} numberOfLines={1}> {d.value} </BrandText>

																: <BrandText style={{letterSpacing: -(20 * 0.04)}}> {d.value} </BrandText>
														}
												</View>
										))}
								</View>
						</View>
				</ScreenContainer2>
		);
};
