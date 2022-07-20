import {FindAName} from "../../components/NameServiceBooking/FindAName"

{/*TODO: STEP3*/}

import React, {useContext, useEffect, useState} from "react"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {BacKTo} from "../../components/Footer"
import {BrandText} from "../../components/BrandText"
import {View} from "react-native"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"
import {NameStatusCard} from "../../components/NameServiceBooking/NameStatusCard"
import {NameNFT} from "../../components/NameServiceBooking/NameNFT"
import {PrimaryButton} from "../../components/buttons/PrimaryButton"
import {HollowPrimaryButton} from "../../components/buttons/HollowPrimaryButton"
import {RouteProp, useNavigation} from "@react-navigation/native"
import {getNonSigningClient} from "../../hooks/cosmwasm"
import {useAppNavigation} from "../../utils/navigation"
import {NSBContext} from "../../context/NSBProvider"
import {useCheckNameAvailability} from "../../hooks/useCheckNameAvailability"

export const NSBExploreScreen: React.FC = () => {
		const navigation = useAppNavigation()
		const {name, setName} = useContext(NSBContext)
		const {nameAvailable, nameError} = useCheckNameAvailability(name)

		return (
				<ScreenContainer2 footerChildren={<BacKTo label="home" navItem="NSBHome"/>}>
						{/*----- The first thing you'll see on this screen is <FindAName> */}
						<FindAName name={name} setName={setName} nameError={nameError} nameAvailable={nameAvailable}>
								{/*-----  If name entered, no error and the name is minted,  we display two buttons */}
								{(name && !nameError && !nameAvailable)
										&&
												<View style={{
												flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
												height: 56, maxHeight: 56, minHeight: 56, maxWidth: 332, width: "100%"
										}}>
												<PrimaryButton
																text="View" big style={{maxWidth: 157, width: "100%"}}
																onPress={() => navigation.navigate("NSBConsultName")}
												/>
												<HollowPrimaryButton
																text="Send funds" style={{maxWidth: 154, width: "100%"}}
                onPress={() => {/*TODO:*/}}
												/>
										</View>
								}
						</FindAName>
				</ScreenContainer2>
		);
};
