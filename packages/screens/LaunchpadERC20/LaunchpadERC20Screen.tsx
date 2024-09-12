import React from "react";

import { BrandText } from "@/components/BrandText";
import { ScreenContainer } from "@/components/ScreenContainer";
import { ScreenFC } from "@/utils/navigation";
import { fontSemibold28 } from "@/utils/style/fonts";

export const LaunchpadERC20Screen: ScreenFC<"LaunchpadERC20"> = () => {
    return (
        <ScreenContainer>
            <BrandText style={fontSemibold28}>Welcome</BrandText>
        </ScreenContainer>
    );
};
