import {ScreenContainer2} from "../../components/ScreenContainer2"

{/*TODO: STEP3 => Here, you can consult a name. If the name is minted by you, the Footer wil contains other actions*/}

import React, {useContext, useEffect, useState} from "react"

import {BacKTo} from "../../components/Footer"
import {PrimaryButton} from "../../components/buttons/PrimaryButton"
import {NSBContext} from "../../context/NSBProvider"
import {useAppNavigation} from "../../utils/navigation"
import {useFocusEffect} from "@react-navigation/native"
import {neutral33, neutral44, neutral77, primaryColor} from "../../utils/colors"
import {DarkButton} from "../../components/buttons/DarkButton"
import {View} from "react-native"
import {NameNFT} from "../../components/NameServiceBooking/NameNFT"
import {CopyToClipboardCard} from "../../components/cards/CopyToClipboardCard"
import {BrandText} from "../../components/BrandText"
import {dataTest} from "../../utils/types/nsb"
import {NameAndDomainText} from "../../components/NameServiceBooking/NameAndDomainText"
import ModalBase from "../../components/modals/ModalBase"
import {numberWithThousandsSeparator} from "../../utils/handefulFunctions"
import {TextInputCustom} from "../../components/inputs/TextInputCustom"

const SendFundModal: React.FC<{
		onClose: () => void
		visible?: boolean
}> = ({onClose, visible}) => {
		const [comment, setComment] = useState("Sent from Teritori")
		const [amount, setAmount] = useState("1000")
		const [_visible, setVisible] = useState(false)

		useEffect(() => {
				setVisible(visible)
		}, [visible])

		return(
				// TODO: dynamic value
				<ModalBase
						visible={_visible} onClose={onClose} width={372}
						label={`Your wallet has ${numberWithThousandsSeparator(1000)} Tori`}
						childrenBottom={
								<View style={{marginHorizontal: 20}}>
										<View style={{ borderBottomWidth: 1, borderColor: neutral44 }} />
										<View style={{flex: 1, flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "space-between", marginVertical: 20}}>
												<BacKTo label="search" navItem={"NSBRegister"} onPress={() => setVisible(false)}/>
												<DarkButton text={"Show paths"} style={{width: "fit-content"}}/>
										</View>
								</View>
						}
				>
						<View>
								<TextInputCustom
										label="COMMENT ?" value={comment} placeHolder="Type your comment here"
										onChangeText={setComment}
										style={{marginBottom: 12}}
								/>
								<View style={{flex: 1, flexDirection: "row"}}>
										<TextInputCustom
												label="TORI AMOUNT ?" value={numberWithThousandsSeparator(amount)} placeHolder="Type your amount here"
												onChangeText={setAmount} wantNumber
												style={{marginRight: 12 , minWidth: 0}}
										/>
										<PrimaryButton text={"Send"} style={{width: "fit-content"}}/>
								</View>
						</View>
				</ModalBase>
		)
}

const NotOwnerActions = () => {
		const [modalVisible, setModalVisible] = useState(false)
		const btnStyle = {marginLeft: 24, width: "fit-content"}
		return (
				<>
						<BacKTo label="search" navItem="NSBRegister"/>
						<PrimaryButton text="Send funds" style={btnStyle} onPress={() => setModalVisible(true)}/>
						<DarkButton text="Show paths" style={btnStyle}/>
						<SendFundModal onClose={() => setModalVisible(false)} visible={modalVisible}/>
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
				// <ScreenContainer2 footerChildren={signedUserIsOwner ? <OwnerActions/> : <NotOwnerActions/>}>
				<ScreenContainer2 footerChildren={<NotOwnerActions/>}>
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
