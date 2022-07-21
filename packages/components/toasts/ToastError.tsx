import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import React from "react"
import {errorColor, neutral11, neutral77} from "../../utils/colors"
import {BrandText, exoFontFamilyFromFontWeight} from "../BrandText"
import ModalBase from "../modals/ModalBase"
import warningPNG from "../../../assets/icons/warning.png"
import {Image, TouchableOpacity, View} from "react-native"
import {headerHeight} from "../HubHeader"


export const ToastError: React.FC<{
		title: string
		text?: string
		onPress: () => void
}> = ({title, text, onPress}) => {
		return (
				<TouchableOpacity onPress={onPress} style={{
						flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: neutral11,
						borderColor: errorColor, borderRadius: 8, borderWidth: 1, borderStyle: "solid",
						width: "100%", maxWidth: 432, height: 72,
						position: "absolute", top: 24, left: `calc(50% - ${432}px / 2)`,
						zIndex: 999
				}}>
						{/*<View style={{*/}
						{/*		flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: neutral11,*/}
						{/*		borderColor: errorColor, borderRadius: 8, borderWidth: 1, borderStyle: "solid",*/}
						{/*		width: "100%", maxWidth: 432, height: 72,*/}
						{/*		position: "absolute", top: 24, left: `calc(50% - ${432}px / 2)`*/}
						{/*}}*/}
						{/*>*/}
								<Image source={warningPNG} style={{width: 24, height: 24, marginHorizontal: 24}}/>
								<View style={{maxWidth: 287}}>
										<BrandText style={{fontSize: 13, lineHeight: 20}}>{title}</BrandText>
										<BrandText style={{fontSize: 13, lineHeight: 15, color: neutral77}}>{text}</BrandText>
								</View>
						{/*</View>*/}
				</TouchableOpacity>
		)
}