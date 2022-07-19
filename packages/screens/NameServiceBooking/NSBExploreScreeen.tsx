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
import {HollowPrimaryButton} from "../../components/buttons/HollowPrimaryButton"
import {RouteProp} from "@react-navigation/native"
import {getNonSigningClient} from "../../hooks/cosmwasm"

export const NSBExploreScreen: React.FC<{
		route: RouteProp<{ params: { name: string } }>
}> = ({route}) => {
		const [name, setName] = useState("")
		const [nameAvailable, setNameAvailable] = useState(false)
		const [nameError, setNameError] = useState(false)

		let cosmWasmClient = null

		// Get the enteredName from the previous screen (NSBHomeScreen)
		useEffect(() => {
				if(route.params && route.params.name)	setName(route.params.name)
		},[route])

		// Query the name service
		useEffect(() => {
				const getToken = async () => {
						const contract = process.env.PUBLIC_WHOAMI_ADDRESS as string

						// We just want to read, so we use a non-signing client
						cosmWasmClient = await getNonSigningClient()

						try {
								// If this query fails it means that the token does not exist.
								const token = await cosmWasmClient.queryContractSmart(contract, {
										nft_info: {
												token_id: name,
										},
								})
								return token.extension
						} catch (e) {
								return undefined
						}
				}

				getToken().then(tokenExtension => {
						// ------ Minted
						if(!tokenExtension) {
								setNameAvailable(true)
								setNameError(false)
						}
						// ------ Available
						else {
								setNameAvailable(false)
								setNameError(false)
						}
				}).catch(e => {
						console.log('ERROR getToken() : ', e)
						setNameAvailable(false)
						setNameError(true)
				})
		}, [name])

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
										onChangeText={setName} value={name}
								/>

								{/*----- When a name is entered, we display its status */}
								{name ? <NameStatusCard available={nameAvailable} hasError={nameError}/> : null	}
								{/*----- If name entered and no error, we display the image */}
								{name && !nameError ? <NameNFT style={{marginVertical: 12}}/> : null}
								{/*-----  If name entered, no error and the name is minted,  we display two buttons */}
								{name && !nameError && !nameAvailable
										? <View style={{
														flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between",
														height: 56, maxHeight: 56, minHeight: 56, maxWidth: 332, width: "100%"
										}}>
												<PrimaryButton text="View" big textStyle={{fontSize: 16}} style={{maxWidth: 157, width: "100%"}}/>
												<HollowPrimaryButton text="Send funds" textStyle={{fontSize: 16}} style={{maxWidth: 154, width: "100%"}}/>
										</View>
										: null
								}
						</View>
				</ScreenContainer2>
		);
};
