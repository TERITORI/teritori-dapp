import { useState } from "react";
import { View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down-white.svg";
import foxCircleSVG from "../../../../assets/icons/networks/fox-circle.svg";
import teritoriSVG from "../../../../assets/icons/networks/teritori.svg";
import teritoriCircleSVG from "../../../../assets/icons/tori-circle.svg";
import { BrandText } from "../../../components/BrandText";
import { Dropdown } from "../../../components/Dropdown";
import { SVG } from "../../../components/SVG";
import { TertiaryBadge } from "../../../components/badges/TertiaryBadge";
import { SpacerColumn, SpacerRow } from "../../../components/spacer";
import { ScreenFC, useAppNavigation } from "../../../utils/navigation";
import {
  neutral33,
  neutralA3,
  secondaryColor,
  withAlpha,
} from "../../../utils/style/colors";
import { fontMedium16 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BlurScreenContainer } from "../components/BlurScreenContainer";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MobileModal from "../components/MobileModal";
import RowDisplay from "../components/RowDisplay";
import MiniTable from "../components/Table/MiniTable";
import TitleBar from "../components/TitleBar";

const toriData = [
  {
    label: "Token",
    value: "0x89383938...A3b2",
    icon: "link",
    onPress: () => alert("Token"),
  },
  {
    label: "Amount",
    value: "8187278373838393837373",
  },
  {
    label: "Expiration",
    value: "157843252",
  },
  {
    label: "Nonce",
    value: "0",
  },
  {
    label: "Network",
    value: <TertiaryBadge iconSVG={teritoriSVG} label="Teritori" />,
  },
  {
    label: (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <CircularImgOrIcon
          size={32}
          enableFullIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={require("../../../../assets/default-images/profile.png")}
        />
        <SpacerRow size={1} />
        <BrandText style={[fontMedium16, { color: neutralA3 }]}>
          ninja.tori
        </BrandText>
      </View>
    ),
    value: "GxF34...3A31",
  },
];

const SendingToriScreen: ScreenFC<"MiniSendingTori"> = ({ navigation }) => {
  const [openModal, setOpenModal] = useState(false);

  const goBackTo = () =>
    navigation.replace("MiniSendTori", { back: "MiniSendingTori" });

  return (
    <BlurScreenContainer title="Sending TORI" onGoBack={goBackTo}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          justifyContent: "space-between",
        }}
      >
        <View>
          <SpacerColumn size={3} />
          <RowDisplay
            leftLabel={
              <SVG source={teritoriCircleSVG} width={28} height={28} />
            }
            rightLabel="2000 TORI"
          />

          <SpacerColumn size={2} />

          <Dropdown
            positionStyle={{ width: "100%", top: 45 }}
            triggerComponent={
              <View style={{ alignItems: "center" }}>
                <SVG source={chevronDownSVG} width={28} height={28} />
              </View>
            }
          >
            <View style={{ flex: 1 }}>
              <RowDisplay
                leftLabel="g10nz0wchvkkj7rr09vcxj5rpt2mfdj056yd2ehvnd"
                leftLabelStyle={{ color: secondaryColor }}
              />
              <SpacerColumn size={1.5} />
              <RowDisplay
                leftLabel="Network Fee"
                rightLabel="0.0000001 TORI"
                rightLabelStyle={fontMedium16}
              />
            </View>
          </Dropdown>
        </View>

        <SendingModal visible={openModal} onClose={() => setOpenModal(false)} />

        <CustomButton title="Send" onPress={() => setOpenModal(true)} />
      </View>
    </BlurScreenContainer>
  );
};

export default SendingToriScreen;

type SendingModalProps = {
  visible: boolean;
  onClose: () => void;
};

function SendingModal({ visible, onClose }: SendingModalProps) {
  const navigation = useAppNavigation();

  return (
    <MobileModal visible={visible} onClose={onClose}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: layout.spacing_x2,
          paddingVertical: layout.spacing_x3,
          justifyContent: "space-between",
        }}
      >
        <View>
          <TitleBar
            title="Signature request"
            icon={foxCircleSVG}
            subTitle="Be careful this message may transfer assets"
          />
          <SpacerColumn size={3} />
          <MiniTable
            items={toriData}
            colorOptions={{ tableColor: withAlpha(neutral33, 0.8) }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <CustomButton
            type="gray"
            title="Cancel"
            onPress={() => navigation.navigate("MiniTabs")}
            style={{ flex: 1 }}
          />
          <CustomButton
            title="Sign"
            onPress={() => navigation.navigate("MiniTabs")}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </MobileModal>
  );
}
