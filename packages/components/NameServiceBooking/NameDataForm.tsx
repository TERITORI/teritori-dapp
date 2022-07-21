//TODO: Step 3 : For Register and Explore

// children = A button

// Name, bio, image url, email, website, twitter, discord, telegram username, keybase.io, validator operator address


import {View} from "react-native"
import React, {useState} from "react"
import {TextInputCustom} from "../inputs/TextInputCustom"
import {PrimaryButton} from "../buttons/PrimaryButton"
import {neutral33, neutral77} from "../../utils/colors"
import {BrandText} from "../BrandText"
import * as path from "path"
import { ExternalLink} from "../ExternalLink"


// TODO: Later, create a reusable Form cpt to avoid writing too much code and call it in NameDataForm.tsx. Maybe use react-hook-form ?

export const NameDataForm: React.FC<{
		isMintPath?: boolean
		btnLabel: string
		onPressBtn: (values: object) => void
}> = ({isMintPath, btnLabel, onPressBtn}) => {
		const [pathId, setPathId] = useState("")
		const [name, setName] = useState("")
		const [bio, setBio] = useState("")
		const [imageUrl, setImageUrl] = useState("")
		const [email, setEmail] = useState("")
		const [website, setWebsite] = useState("")
		const [twitter, setTwitter] = useState("")
		const [discord, setDiscord] = useState("")
		const [telegramUsername, setTelegrameUsername] = useState("")
		const [keybaseIo, setKeybaseIo] = useState("")
		const [validatorOperatorAddress, setValidatorOperatorAddress] = useState("")

		const inputStyle = {marginBottom: 12, width: "100%"}
		const profileDataTextStyle = {color: neutral77, fontSize: 16}

		const _onPressBtn = () => {
				const date = {
						pathId,
						name,
						public_bio: bio,
						imageUrl,
						email,
						external_url: website,
						twitter_id: twitter,
						discord_id: discord,
						telegram_id: telegramUsername,
						keybase_id: keybaseIo,
						validator_operator_address: validatorOperatorAddress
				}

						// image,
						// image_data,
						// email,
						// external_url,
						// public_name,
						// public_bio,
						// twitter_id,
						// discord_id,
						// telegram_id,
						// keybase_id,
						// validator_operator_address,

				onPressBtn(date)
		}

		return (
				<View style={{
						flex: 1, alignItems: "center",
						width: "100%", maxWidth: 396, maxHeight: isMintPath ? 852 : 700, minHeight: isMintPath ? 852 : 700,
						paddingBottom: 20, paddingTop: 24, paddingHorizontal: 24,
						backgroundColor: "#000000", borderWidth: 1, borderColor: neutral33,	borderRadius: 8,
				}}>
						{isMintPath
								? <>
										<View style={{width: 210, height: 72, minHeight: 72, flex: 1, marginBottom: 20, alignSelf: "flex-start"}}>
														<BrandText style={{marginBottom: 8}}>Profile data</BrandText>
              <BrandText style={profileDataTextStyle}>Tip: to generate a PFP URL, use a service like{" "}
																		<ExternalLink externalUrl={"https://www.pinata.cloud/"} style={{fontSize: 16}}>
																						Pinata
																		</ExternalLink>
																		.
														</BrandText>
										</View>
										<TextInputCustom
														style={inputStyle}
														label="Path ID (must be unique)" placeHolder="Type path ID here"
														value={pathId} onChangeText={setPathId}
										/>
								</>
								: null
						}
						<TextInputCustom
								style={inputStyle}
								label="NAME" placeHolder="Type name here"
								value={name} onChangeText={setName}
						/>
						<TextInputCustom
								style={inputStyle}
								label="BIO" placeHolder="Type bio here"
								value={bio} onChangeText={setBio}
						/>
						<TextInputCustom
								style={inputStyle}
								label="IMAGE URL" placeHolder="Insert image URL here"
								value={imageUrl} onChangeText={setImageUrl}
						/>
						<TextInputCustom
								style={inputStyle}
								label="EMAIL" placeHolder="Type email here"
								value={email} onChangeText={setEmail}
						/>
						<TextInputCustom
								style={inputStyle}
								label="WEBSITE" placeHolder="Type/insert link here"
								value={website} onChangeText={setWebsite}
						/>
						<TextInputCustom
								style={inputStyle}
								label="TWITTER" placeHolder="Link to Twitter account"
								value={twitter} onChangeText={setTwitter}
						/>
						<TextInputCustom
								style={inputStyle}
								label="DISCORD" placeHolder="Link to Discord group"
								value={discord} onChangeText={setDiscord}
						/>
						<TextInputCustom
								style={inputStyle}
								label="TELEGRAM USERNAME" placeHolder="@nickname"
								value={telegramUsername} onChangeText={setTelegrameUsername}
						/>
						<TextInputCustom
								style={inputStyle}
								label="KEYBASE.IO" placeHolder="Type/insert link here"
								value={keybaseIo} onChangeText={setKeybaseIo}
						/>
						<TextInputCustom
								style={inputStyle}
								label="VALIDATOR OPERATOR ADDRESS" placeHolder="Type/insert link here"
								value={validatorOperatorAddress} onChangeText={setValidatorOperatorAddress}
						/>
						<PrimaryButton text={btnLabel} onPress={_onPressBtn} style={{marginTop: 8}}/>
				</View>
		)
}