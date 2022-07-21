import React, {useState} from "react"
import {View, Image, TouchableOpacity} from "react-native"
import Clipboard from '@react-native-clipboard/clipboard'
import copyPNG from "../../../assets/icons/copy.png"
import {BrandText} from "../BrandText"
import {neutral23, neutral33} from "../../utils/colors"
import ModalBase from "../modals/ModalBase"

export const CopyToClipboardCard: React.FC<{
		text: string
}> = ({text}) => {
		const [feedbackVisible, setFeedbackVisible] = useState(false)

		const copyToClipboard = () => {
				setFeedbackVisible(true)
				Clipboard.setString(text)
		}

		return (
				<TouchableOpacity onPress={copyToClipboard}>
					<View style={{
							flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center",
							width: "100%", maxWidth: 332, height: 40, maxHeight: 40, minHeight: 40,
							backgroundColor: neutral23,
							borderWidth: 1, borderColor: neutral33, borderRadius: 8
					}}>
							<BrandText style={{fontSize: 14, fontWeight: "500", marginLeft: 12}}> {text} </BrandText>
							<Image source={copyPNG} style={{width: 24, height: 24, marginRight: 12}}/>
					</View>

						{/*TODO: Make a SuccessToast instead of a modal ?*/}
						<ModalBase label="Copied" onClose={() => setFeedbackVisible(false)} visible={feedbackVisible}/>
				</TouchableOpacity>
		)
}
