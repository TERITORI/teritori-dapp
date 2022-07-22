import {Header} from "./Header"

// TODO: STEP3
//*TODO: Name ScreenContainer2 with an explicit name. Difference with ScreenContainer : Header and not SideBar, simpler, ...

import React, {ReactElement, useContext} from "react"
import {
		SafeAreaView,
		View,
		StyleSheet, ScrollView
} from "react-native"
import {Footer} from "./Footer"
import {WalletsManager} from "./WalletsManager"
import {ToastError} from "./toasts/ToastError"
import {initialNsbError, NSBContext} from "../context/NSBProvider"


// TODO: Why not React.FC<{...}> ?
export const ScreenContainer2: React.FC<{
		footerChildren?: ReactElement;
}> = ({children, footerChildren}) => {
		const {nsbError, setNsbError} = useContext(NSBContext)

		return (
				<SafeAreaView style={{width: "100%", flex: 1}}>


						<View style={styles.container}>
								<View style={{ width: "100%", flex: 1, justifyContent: "space-between"}}>

										<View style={{ flex: 1}}>
												<Header/>

												{nsbError && nsbError.title
														? <ToastError
																onPress={() => setNsbError(initialNsbError)}
																title={nsbError.title}
																message={nsbError.message}
														/>
														: null
												}

												{/*TODO: Better scroll. Footer in ScrollView ? ... */}
												<ScrollView
														style={{ width: "100%", flex: 1 }}
														contentContainerStyle={{ flex: 1 }}
												>
													<>{children}</>
												</ScrollView>
										</View>

										<Footer>
												{footerChildren}
										</Footer>
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
