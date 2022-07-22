import {Image, StyleSheet, View, ViewStyle} from "react-native"
import {neutral33} from "../../utils/colors"
import React from "react"
import defaultNameNFT from "../../../assets/default-name-nft.png"
import {NameAndDomainText} from "./NameAndDomainText"

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
		style?: ViewStyle;
		name: string
}> = ({style, name}) => {

		const width = 332
		const height = 404
		const imageMargin = 12
		return (
				<View style={[{
						flex: 1, alignItems: "center",
						borderColor: neutral33,
						borderWidth: 1, borderRadius: 8, backgroundColor: "#000000",
						height, minHeight: height, maxHeight: height, width: "100%", maxWidth: width
				}, style]}>
						{/*TODO: Dynamic value*/}
						<Image
								source={defaultNameNFT}
								style={{width: width -imageMargin*2, height: width -imageMargin*2, margin: imageMargin}}
						/>

						{/*TODO: Dynamic value*/}
						<NameAndDomainText nameAndDomainStr={name + ".tori"}/>
				</View>
		)
}