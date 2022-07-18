import {Image, TextInput, View} from "react-native"
import {errorColor, neutral33, neutral77, successColor} from "../../utils/colors"
import {BrandText} from "../BrandText"
import {NetworkIcon} from "../NetworkIcon"
import React, {useState} from "react"
import mintedPNG from "../../../assets/icons/minted.png"
import availablePNG from "../../../assets/icons/available.png"
import {err} from "react-native-svg/lib/typescript/xml"

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameStatusCard: React.FC<{
		available?: boolean;
		hasError?: boolean;
}> = ({available, hasError}) => {

		return (
				<View style={{
						flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start",
						borderColor: hasError ? errorColor : available ? successColor : errorColor,
						borderWidth: 1, borderRadius: 8,
						backgroundColor: "#000000",
						height: 48, minHeight: 48, maxHeight: 48, width: 332,
						paddingHorizontal: 12,
				}}>
						<Image source={available ? availablePNG : mintedPNG} style={{width: 24, height: 24}}/>
						<BrandText style={{ fontSize: 14, marginLeft: 4}}>
								{hasError ? "error" : available ? "available" : "minted"}
						</BrandText>
				</View>
		)
}