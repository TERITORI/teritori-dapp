import { FC, ReactNode } from "react";
import { View } from "react-native";

import { Footer } from "../../../components/footers/Footer";
import { useMaxResolution } from "../../../hooks/useMaxResolution";

// Layout and Footer for UPP Screens.  Ex in DAOsUPPScreen.tsx
// The UPP screens that use NewsFeed shouldn't use this wrapper. Ex in FeedPostsUPPScreen.tsx
export const UPPScreenContentWrapper: FC<{
  children: ReactNode | ReactNode[];
}> = ({ children }) => {
  const { width } = useMaxResolution();
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <View style={{ width }}>{children}</View>

      <Footer />
    </View>
  );
};
