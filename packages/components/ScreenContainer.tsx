import React, {ReactElement, useContext, useState} from "react"
import {
		Modal,
		SafeAreaView,
		ScrollView,
		View,
		StyleSheet,
		useWindowDimensions,
		Platform, ViewStyle
} from "react-native"

import {Header} from "./Header"
import {Sidebar} from "./navigation/Sidebar"
import {WalletsManager} from "./WalletsManager"
import {screenContainerContentMarginH, sidebarWidth} from "../utils/layout"
import {ToastError} from "./toasts/ToastError"
import {ToastSuccess} from "./toasts/ToastSuccess"
import {Footer} from "./Footer"
import {FeedbacksContext, initialToastError, initialToastSuccess} from "../context/FeedbacksProvider"

export const ScreenContainer: React.FC<{
		headerChildren?: ReactElement;
  footerChildren?: ReactElement;
		headerStyle?: ViewStyle;
		hideSidebar?: boolean;
}> = ({
  children,
  headerChildren,
  footerChildren,
		headerStyle,
																																						hideSidebar
}) => {
		const [modalVisible, setModalVisible] = useState(false)
		const {height} = useWindowDimensions()

  return (
				<SafeAreaView style={{width: "100%", flex: 1}}>
						<Modal
								animationType="slide"
								transparent
								visible={modalVisible}
								onRequestClose={() => setModalVisible(!modalVisible)}
						>
								<WalletsManager onClose={() => setModalVisible(!modalVisible)}/>
						</Modal>

						<View style={styles.container}>
								<View style={{width: "100%", flex: 1}}>
          {/*==== Header*/}
										<Header style={headerStyle}>{headerChildren}</Header>

										<View
												style={{width: "100%", flexDirection: "row", flex: 1, height}}
										>
												{["android", "ios"].includes(Platform.OS) || (!hideSidebar ? <Sidebar/> : null)}

            {/*==== Scrollable screen content*/}
												<ScrollView
														style={{width: "100%", flex: 1}}
														contentContainerStyle={{flex: 1, marginHorizontal: screenContainerContentMarginH}}
												>
														<>{children}</>
												</ScrollView>

										</View>
          {/*==== Footer*/}
										<Footer style={!hideSidebar && {paddingLeft: sidebarWidth}}> {footerChildren}</Footer>
								</View>
						</View>
				</SafeAreaView>
		)
}

const styles = StyleSheet.create({
		container: {
				flex: 1,
				backgroundColor: "#000000",
				alignItems: "center",
				justifyContent: "flex-start"
		}
})
