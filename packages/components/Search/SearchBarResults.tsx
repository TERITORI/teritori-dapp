import React, { FC, ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { MintState } from "../../api/marketplace/v1/marketplace";
import { useSearchBar } from "../../context/SearchBarProvider";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import { useAppNavigation } from "../../utils/navigation";
import { neutral22, neutralA3 } from "../../utils/style/colors";
import { fontSemibold12 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { CollectionView } from "../CollectionView";
import { AvatarWithName } from "../user/AvatarWithName";

const SEARCH_RESULTS_NAMES_MARGIN = layout.spacing_x1;
export const SEARCH_RESULTS_MARGIN = layout.spacing_x2;
export const SEARCH_RESULTS_COLLECTIONS_MARGIN = layout.spacing_x0_5;

export const SearchBarResults: FC = () => {
  const selectedNetworkId = useSelectedNetworkId();
  const {
    hasCollections,
    hasNames,
    names,
    collections,
    setSearchModalMobileOpen,
  } = useSearchBar();
  const navigation = useAppNavigation();

  return (
    <>
      {hasNames && (
        <SearchResultsSection
          title="Teritori Name Service"
          style={{ width: "100%" }}
          isFirstSection
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -SEARCH_RESULTS_NAMES_MARGIN,
            }}
          >
            {names.map((n) => (
              <AvatarWithName
                key={n}
                networkId={selectedNetworkId}
                name={n}
                style={{ margin: SEARCH_RESULTS_NAMES_MARGIN }}
                onPress={(userId) => {
                  setSearchModalMobileOpen(false);
                  navigation.navigate("UserPublicProfile", { id: userId });
                }}
              />
            ))}
          </View>
        </SearchResultsSection>
      )}

      {hasCollections && (
        <SearchResultsSection title="Collections" style={{ width: "100%" }}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              margin: -SEARCH_RESULTS_COLLECTIONS_MARGIN,
            }}
          >
            {collections.map((c) => {
              return (
                <View
                  key={c.id}
                  style={{ margin: SEARCH_RESULTS_COLLECTIONS_MARGIN }}
                >
                  <CollectionView
                    key={c.id}
                    item={c}
                    size="XS"
                    mintState={MintState.MINT_STATE_UNSPECIFIED}
                    onPress={() => setSearchModalMobileOpen(false)}
                  />
                </View>
              );
            })}
          </View>
        </SearchResultsSection>
      )}
    </>
  );
};

const SearchResultsSection: React.FC<{
  title: string;
  style: StyleProp<ViewStyle>;
  isFirstSection?: boolean;
  children: ReactNode;
}> = ({ children, title, isFirstSection, style }) => {
  const isMobile = useIsMobile();
  return (
    <View style={style}>
      <View
        style={[
          { backgroundColor: neutral22, paddingVertical: 4 },
          isFirstSection &&
            !isMobile && { borderTopStartRadius: 6, borderTopEndRadius: 6 },
        ]}
      >
        <BrandText
          style={[
            { marginLeft: SEARCH_RESULTS_MARGIN, color: neutralA3 },
            fontSemibold12,
          ]}
        >
          {title}
        </BrandText>
      </View>
      <View style={{ padding: SEARCH_RESULTS_MARGIN }}>{children}</View>
    </View>
  );
};
