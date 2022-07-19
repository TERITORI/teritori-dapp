import {isNameAvailable} from "../../utils/nameService"

{/*TODO: STEP3*/}

import React, {useEffect, useState} from "react"
import {ScreenContainer2} from "../../components/ScreenContainer2"
import {BacKTo} from "../../components/Footer"
import {BrandText} from "../../components/BrandText"
import {View} from "react-native"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"
import {NameStatusCard} from "../../components/NameServiceBooking/NameStatusCard"
import {NameNFT} from "../../components/NameServiceBooking/NameNFT"
import {PrimaryButton} from "../../components/buttons/PrimaryButton"
import {SecondaryButton} from "../../components/buttons/SecondaryButton"
import {HollowPrimaryButton} from "../../components/buttons/HollowPrimaryButton"
import {RouteProp} from "@react-navigation/native"

export const NSBExploreScreen: React.FC<{
		route: RouteProp<{ params: { enteredName: string } }>
}> = ({route}) => {
		const [enteredName, setEnteredName] = useState("")
		const [enteredNameAvailable, setEnteredNameAvailable] = useState(false)
		const [enteredNameError, setEnteredNameError] = useState(false)

		useEffect(() => {
				setEnteredName(route.params?.enteredName)
		},[route])

		useEffect(() => {
				console.log('enteredName', enteredName)

				if(enteredName) {
						isNameAvailable(enteredName).then(isAvailable => {
								setEnteredNameError(false)
								setEnteredNameAvailable(isAvailable)
						}).catch(e => {
								console.log('ERROR isNameAvailable() : ', e)
								setEnteredNameError(true)
								setEnteredNameAvailable(false)
						})
				}
		}, [enteredName])

		const titleFontSize = 48

		return (
				<ScreenContainer2 footerChildren={
						<BacKTo label="home" navItemLabel="Home"/>
				}>
						<View style={{flex: 1, flexDirection: "column", alignItems: "center"}}>
								<BrandText
										style={{fontSize: titleFontSize, lineHeight: 64, letterSpacing: -(titleFontSize * 0.04), marginBottom: 24, marginTop: 32}}
								>
										Find a name
								</BrandText>

								<TextInputCustom
										label="name" placeHolder="Type name here" style={{marginBottom: 12}}
										onChangeText={setEnteredName} value={enteredName}
								/>

								{enteredName ? <NameStatusCard available={enteredNameAvailable} hasError={enteredNameError}/> : null	}
								{/*<NameStatusCard available={enteredNameAvailable} hasError={enteredNameError}/>*/}
								{enteredName && !enteredNameError ? <NameNFT style={{marginTop: 12}}/> : null}
								{/*<NameNFT style={{marginTop: 12, marginBottom: 20}}/>*/}
								{enteredName && !enteredNameAvailable && !enteredNameError
										? <View style={{
												flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
												height: 56, maxHeight: 56, minHeight: 56, maxWidth: 332, width: "100%"
										}}>
												<PrimaryButton text="View" big textStyle={{fontSize: 16}} style={{maxWidth: 157, width: "100%"}}/>
												<HollowPrimaryButton text="Send funds" textStyle={{fontSize: 16}} style={{maxWidth: 154, width: "100%"}}/>
										</View>
										: null
								}
								{/*<View style={{*/}
								{/*		flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between",*/}
								{/*		height: 56, maxHeight: 56, minHeight: 56, maxWidth: 332, width: "100%"*/}
								{/*}}>*/}
								{/*		<PrimaryButton text="View" big textStyle={{fontSize: 16}} style={{maxWidth: 157, width: "100%"}}/>*/}
								{/*		<HollowPrimaryButton text="Send funds" textStyle={{fontSize: 16}} style={{maxWidth: 154, width: "100%"}}/>*/}
								{/*</View>*/}
						</View>
				</ScreenContainer2>
		);
};
