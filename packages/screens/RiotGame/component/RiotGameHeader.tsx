import { useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SvgProps } from "react-native-svg";

import cartSVG from "../../../../assets/icons/cart.svg";
import diamondSVG from "../../../../assets/icons/diamond.svg";
import fightSVG from "../../../../assets/icons/fight.svg";
import filmSVG from "../../../../assets/icons/film.svg";
import gameBoxSVG from "../../../../assets/icons/game-box.svg";
import inventorySVG from "../../../../assets/icons/inventory.svg";
import trophiesSVG from "../../../../assets/icons/trophies.svg";
import { BrandText } from "../../../components/BrandText";
import { ConnectWalletButton } from "../../../components/ConnectWalletButton";
import { NetworkSelector } from "../../../components/NetworkSelector";
import { SVG } from "../../../components/SVG";
import { Separator } from "../../../components/Separator";
import Row from "../../../components/grid/Row";
import { LogoTop } from "../../../components/navigation/components/TopLogo";
import { SpacerRow } from "../../../components/spacer";
import {
  RootStackParamList,
  useAppNavigation,
} from "../../../utils/navigation";
import {
  neutral33,
  neutralA3,
  yellowDefault,
} from "../../../utils/style/colors";
import { flex } from "../../../utils/style/flex";
import { fontMedium16 } from "../../../utils/style/fonts";
import { headerHeight, layout } from "../../../utils/style/layout";

type MenuItem = {
  id: string;
  name: string;
  route: keyof RootStackParamList;
  iconSVG: React.FC<SvgProps>;
};

const MENU_ITEMS: MenuItem[] = [
  { id: "fight", name: "Fight", route: "RiotGameEnroll", iconSVG: fightSVG },
  {
    id: "inventory",
    name: "Inventory",
    route: "RiotGame",
    iconSVG: inventorySVG,
  },
  {
    id: "breeding",
    name: "Breeding",
    route: "RiotGameBreeding",
    iconSVG: gameBoxSVG,
  },
  {
    id: "leaderboard",
    name: "Leaderboard",
    route: "RiotGame",
    iconSVG: trophiesSVG,
  },
  {
    id: "rarity",
    name: "Rarity",
    route: "RiotGame",
    iconSVG: diamondSVG,
  },
  {
    id: "marketplace",
    name: "Marketplace",
    route: "RiotGameMarketplace",
    iconSVG: cartSVG,
  },
  {
    id: "memories",
    name: "Memories",
    route: "RiotGameMemories",
    iconSVG: filmSVG,
  },
];

type RiotGameHeaderProps = {
  hideMenu?: boolean;
};

export const RiotGameHeader: React.FC<RiotGameHeaderProps> = ({
  hideMenu = false,
}) => {
  const navigation = useAppNavigation();
  const { name: routeName } = useRoute();

  const onMenuItemClick = (item: MenuItem) => {
    // FIXME: fix typescript here
    navigation.navigate(item.route as any);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <View>
          <LogoTop />
        </View>

        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.menu}
        >
          {!hideMenu && (
            <Row>
              {MENU_ITEMS.map((menuItem) => {
                // Enroll and Fight are under the same menu item
                let _routeName = routeName;
                if (_routeName === "RiotGameFight")
                  _routeName = "RiotGameEnroll";

                const color =
                  menuItem.route === _routeName ? yellowDefault : neutralA3;

                return (
                  <TouchableOpacity
                    onPress={() => onMenuItemClick(menuItem)}
                    style={layout.mr_4}
                    key={menuItem.id}
                  >
                    <Row style={flex.alignItemsCenter}>
                      <SVG
                        width={16}
                        height={16}
                        color={color}
                        source={menuItem.iconSVG}
                        style={layout.mr_1}
                      />
                      <BrandText style={[fontMedium16, { color }]}>
                        {menuItem.name}
                      </BrandText>
                    </Row>
                  </TouchableOpacity>
                );
              })}
            </Row>
          )}
        </ScrollView>

        <View style={styles.section}>
          <Separator horizontal color={neutral33} />
          <SpacerRow size={1.5} />
          <NetworkSelector />
          <SpacerRow size={1.5} />
          <ConnectWalletButton />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    height: headerHeight,
    width: "100%",
    zIndex: 1000,
  },
  innerContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: neutral33,
    flexDirection: "row",
    alignItems: "center",
  },
  menu: {
    paddingHorizontal: 40,
  },
  section: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
});
