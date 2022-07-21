import {ScreenContainer2} from "../../components/ScreenContainer2"

{/*TODO: STEP3 Can edit if the current user is owner and the name is minted. Can create if the name is available*/}

import React, {useContext, useEffect, useState} from "react"
import * as R from 'ramda'

import {Image, TouchableOpacity, View} from "react-native"
import {BacKTo} from "../../components/Footer"
import {NameDataForm} from "../../components/NameServiceBooking/NameDataForm"
import {NameNFT} from "../../components/NameServiceBooking/NameNFT"
import longCardPNG from "../../../assets/cards/long-card.png"
import coinPNG from "../../../assets/icons/coin.png"
import {BrandText} from "../../components/BrandText"
import {ToastError} from "../../components/toasts/ToastError"
import {NSBContext} from "../../context/NSBProvider"
import {useStore} from "../../store/cosmwasm"
import {useSigningClient} from "../../context/cosmwasm"
import {defaultMintFee, getMintCost} from "../../utils/fee"
import {convertDenomToHumanReadableDenom, convertMicroDenomToDenom} from "../../utils/conversion"
import {defaultMemo} from "../../utils/memo"
import {ParamListBase, RouteProp} from "@react-navigation/native"
import {useAppNavigation} from "../../utils/navigation"


const defaults = {
		image: null,
		image_data: null,
		email: null,
		external_url: null,
		public_name: null,
		public_bio: null,
		twitter_id: null,
		discord_id: null,
		telegram_id: null,
		keybase_id: null,
		validator_operator_address: null,
}

const CostContainer: React.FC = () => {
		const innerHeight = 32

		return (
				<View >
						<Image
								source={longCardPNG}
								style={{width: 748, height: 80, resizeMode: "stretch"}}
						/>
						<View style={{
								flex: 1, flexDirection: "row", alignItems: "center",
								position: 'absolute',
								height: innerHeight,
								top: `calc(50% - ${innerHeight}px / 2)`
						}}>
								<Image
										source={coinPNG}
										style={{
												width: 32,
												height: 32,
												resizeMode: "stretch",
												marginLeft: 24,
												marginRight: 12
										}}
								/>

								{/*TODO: Dynamic value*/}
								<BrandText>The mint cost for this token is 1,000 Tori</BrandText>
						</View>

				</View>
		)
}

// Can edit if the current user is owner and the name is minted. Can create if the name is available
export const NSBEditCreateNameScreen: React.FC = () => {
		const {name, setNsbError} = useContext(NSBContext)
		const navigation = useAppNavigation()

		useEffect(() => {
				if(!name) navigation.navigate("NSBHome")
		})



//////////////////


		// // const router = useRouter()
		const { signingClient, walletAddress } = useSigningClient()
		// const contractAddress = process.env.NEXT_PUBLIC_WHOAMI_ADDRESS as string
		// const denom = process.env.NEXT_PUBLIC_STAKING_DENOM as string
		// const [token, setToken] = useState(defaults)
		// const [loading, setLoading] = useState(false)
		// const [error, setError] = useState()
		//
		// const appendTokenId = useStore((state) => state.appendTokenId)
		//
		// // if (!router.isReady) {
		// // 		return null
		// // }
		// // const token_id = router.query.name as string
		//
		// // this returns an array of denoms.
		// // in practice we usually want the first for display
		// // and the array for sending to the contract
		// const mintCost = getMintCost(name)
		// const humanMintCost = convertMicroDenomToDenom(mintCost[0].amount)
		// const humanDenom = R.toUpper(convertDenomToHumanReadableDenom(denom))
		//
		const submitData = async (data) => {
				console.log('gbzfkhzvbkzbzoizvboibiol=====', data)
		//
		//

				console.log('signingClient', signingClient)
				console.log('walletAddress', walletAddress)

				if (!signingClient || !walletAddress) {
						return
				}
		//
		// 		setLoading(true)
		//
		// 		const {
		// 				image,
		// 				image_data,
		// 				email,
		// 				external_url,
		// 				public_name,
		// 				public_bio,
		// 				twitter_id,
		// 				discord_id,
		// 				telegram_id,
		// 				keybase_id,
		// 				validator_operator_address,
		// 		} = data
		//
		// 		// this should already be done,
		// 		// but paranoia, ok?
		// 		const normalizedTokenId = R.toLower(name)
		//
		// 		const msg = {
		// 				mint: {
		// 						owner: walletAddress,
		// 						token_id: normalizedTokenId,
		// 						token_uri: null, // TODO - support later
		// 						extension: {
		// 								image,
		// 								image_data, // TODO - support later
		// 								email,
		// 								external_url,
		// 								public_name,
		// 								public_bio,
		// 								twitter_id,
		// 								discord_id,
		// 								telegram_id,
		// 								keybase_id,
		// 								validator_operator_address,
		// 						},
		// 				},
		// 		}
		//
		// 		try {
		// 				let mintedToken = await signingClient.execute(
		// 						walletAddress!,
		// 						contractAddress,
		// 						msg,
		// 						defaultMintFee,
		// 						defaultMemo,
		// 						mintCost
		// 				)
		// 				if (mintedToken) {
		// 						// router.push({
		// 						// 		pathname: `/tokens/${name}`,
		// 						// })
		//
		// 						// TODO: =========================== HERE OK ?
		//
		// 						console.log('______________________________________________________________')
		// 						appendTokenId(name)
		// 						// setLoading(false)
		// 				}
		// 		} catch (e) {
		// 				// TODO env var for dev logging
		// 				// console.log(e)
		// 				setError(e.message)
		// 				setLoading(false)
		// 		}
		}
		//
		//




		//////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////:::


		const createUsername = () => {
				//TODO: Do that on the chain

				//TODO: If no enought tokens :
				setNsbError({title: "Something went wrong!", text: "Account does not exist on chain. Send some tokens there before trying to query sequence."})
				/////
		}

		return (
				//TODO: If the user is owner : BacKTo label="{name}" navItem="NSBConsult"/>
				//If the user is not the owner : BacKTo label="search" navItem="NSBRegister"/>
				<ScreenContainer2 footerChildren={<BacKTo label="search" navItem="NSBRegister"/>}>

						<View style={{flex: 1, alignItems: "center", marginTop: 32}}>

								{/*TODO: If the user is not the owner*/}
								<CostContainer/>
								{/*///////*/}

								<View style={{flex: 1, flexDirection: "row", justifyContent: "center", marginTop: 20}}>

										{/*TODO: If the user is not the owner*/}
									<NameNFT style={{marginRight: 20}} name={name}/>
										{/*///////*/}

										{/*TODO: If the user is the owner, but he want to mint parh*/}
										<NameNFT style={{marginRight: 20}} name={name}/>
										{/*///////*/}

										<NameDataForm btnLabel="Create username" onPressBtn={submitData}/>
								</View>
						</View>
				</ScreenContainer2>
		);
};
