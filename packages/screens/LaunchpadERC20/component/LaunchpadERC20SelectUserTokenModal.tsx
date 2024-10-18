import { useState } from "react";
import { View } from "react-native";

import { LaunchpadERC20TokensDropdown } from "./LaunchpadERC20TokensDropdown";

import { BrandText } from "@/components/BrandText";
import FlexRow from "@/components/FlexRow";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import ModalBase from "@/components/modals/ModalBase";
import { SpacerColumn } from "@/components/spacer";
import { useAppNavigation } from "@/utils/navigation";
import { errorColor, neutral77 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { emptyToken, Token } from "@/utils/types/types";

interface SelectTokenModalProps {
  isVisible: boolean;
  onClose: () => void;
  items: Token[] | undefined | null;
}

export const SelectUserTokenModal: React.FC<SelectTokenModalProps> = ({
  isVisible,
  onClose,
  items,
}) => {
  const [selectedItem, setSelectedItem] = useState<Token>(emptyToken);
  const props = { isVisible, onClose };
  const navigation = useAppNavigation();

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <ModalBase
        onClose={props.onClose}
        label="Select your ERC20 Token"
        visible={props.isVisible}
        width={480}
      >
        <BrandText style={[{ color: neutral77 }, fontSemibold14]}>
          Select your ERC20 Token
        </BrandText>
        <SpacerColumn size={2.5} />
        {items && items.length !== 0 ? (
          <LaunchpadERC20TokensDropdown
            items={items}
            setSelectedItem={setSelectedItem}
            selectedItem={selectedItem}
          />
        ) : (
          <BrandText style={[{ color: errorColor }, fontSemibold14]}>
            You don't have any ERC20 tokens
          </BrandText>
        )}
        <SpacerColumn size={3.5} />
        <FlexRow style={{ justifyContent: "center" }}>
          <PrimaryButton
            onPress={() => {
              navigation.navigate("LaunchpadERC20ManageToken", {
                token: selectedItem,
              });
              onClose();
            }}
            text="Open"
            size="SM"
            disabled={!selectedItem}
          />
        </FlexRow>
        <SpacerColumn size={2} />
      </ModalBase>
    </View>
  );
};
