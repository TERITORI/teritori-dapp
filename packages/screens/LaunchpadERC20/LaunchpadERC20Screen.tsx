import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { SpacerColumn } from "@/components/spacer";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontSemibold14, fontSemibold28 } from "@/utils/style/fonts";
import React from "react";
import { StyleSheet } from "react-native";
import { LaunchpadERC20Banner } from "./component/LaunchpadERC20Banner";


export const LaunchpadERC20Screen: ScreenFC<"LaunchpadERC20"> = () => {
    return (
        <ScreenContainer>
            <LaunchpadERC20Banner />
            <SpacerColumn size={2} />
            <BrandText style={fontSemibold28}>Welcome on the ERC20 Launchpad</BrandText>
            <SpacerColumn size={2} />
            <BrandText style={styles.descriptionText}>
                Looking to create your own ERC20 token? Look no further.
            </BrandText>
            <SpacerColumn size={2} />
            <BrandText style={styles.descriptionText}>
                Teritori provide a simple and efficient way to create your own ERC20 token.
            </BrandText>
            <BrandText style={styles.descriptionText}>
                In few clicks, you can create your own tokens, airdrops and sales to engage with your community.
            </BrandText>
        </ScreenContainer>
    );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
    descriptionText: StyleSheet.flatten([
        fontSemibold14,
        {
            color: neutral77,
        },
    ]),
    buttonsContainer: {
        flexDirection: "row",
        flex: 1,
    },
});
