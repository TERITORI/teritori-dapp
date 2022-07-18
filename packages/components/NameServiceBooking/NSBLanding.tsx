import {FlowCard} from "../cards/FlowCard"


import registerIconPNG from "../../../assets/icons/register.png"
import manageIconPNG from "../../../assets/icons/manage.png"
import exploreIconPNG from "../../../assets/icons/explore.png"

{/*TODO: STEP3*/}

import React from "react"
import {
		View,
		Image,
		ViewStyle,
		useWindowDimensions,
		TouchableOpacity,
		ImageSourcePropType
} from "react-native"
import {useAppNavigation} from "../../utils/navigation"


const breakPoint = 768
const gridHalfGutter = 12

const launchpadItemHeight = 266
const launchpadItemWidth = 196



export const NSBLanding: React.FC = () => {
		const navigation = useAppNavigation()
		// const {width: windowWidth} = useWindowDimensions()
		// const { launchpadItems: unfilteredLaunchpadItems } = useLaunchpadData();
		// const launchpadItems = unfilteredLaunchpadItems.filter(
		// 		(item) => item.shouldDisplay && item.imageURL
		// );

		const landingHorizontalPadding = 25;

		return (
				<View
						style={{
								marginHorizontal: "auto",
								marginTop: 40,
								paddingHorizontal: landingHorizontalPadding
				}}
				>

								<FlowCard label="Register" description="Register and configure a new name" iconSource={registerIconPNG}/>
								<FlowCard label="Manage" description="Transfer, edit, or burn a name that you own" iconSource={manageIconPNG}/>
								<FlowCard
										label="Explore" description="Lookup addresses and explore registered names"
										iconSource={exploreIconPNG}
										onPress={() => navigation.navigate("NSBExplore")}
								/>

				</View>
		)
}
