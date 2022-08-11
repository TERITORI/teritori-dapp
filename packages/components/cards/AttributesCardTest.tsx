import React from "react"
import {ViewStyle, TouchableOpacity, View} from "react-native"

import AttributesCardSvg from "../../../assets/cards/attributes-card.svg"
import {BrandText} from "../BrandText"
import {fontMedium14, fontSemibold12} from "../../utils/style/fonts"
import {neutral22, neutral33, neutral77} from "../../utils/style/colors"
import {TertiaryCardTest} from "./TertiaryCardTest"
import {SecondaryCardTest} from "./SecondaryCardTest"

export const AttributesCardTest: React.FC<{
		style?: ViewStyle;
		label: string;
		value: string;
}> = ({style, label, value}) => {
		return (
				<SecondaryCardTest style={style} backgroundColor={neutral22} width={132} height={62} paddingH={12} paddingV={14}>
						<BrandText style={[fontSemibold12, {color: neutral77, marginBottom: 6}]}>{label}</BrandText>
						<BrandText style={[fontMedium14]}>{value}</BrandText>
				</SecondaryCardTest>
		)
}
