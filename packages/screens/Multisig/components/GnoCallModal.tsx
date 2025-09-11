import { useCallback, useState } from "react";
import { View, ViewStyle } from "react-native";

import { BrandText } from "@/components/BrandText";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import ModalBase from "@/components/modals/ModalBase";
import { getNetwork } from "@/networks";

interface GnoCallModalButtonProps {
  networkId?: string;
}

export const GnoCallModalButton: React.FC<GnoCallModalButtonProps> = ({
  networkId,
}) => {
  const network = getNetwork(networkId);
  const [isVisible, setVisible] = useState(false);
  return (
    <>
      <PrimaryButton
        size="M"
        text="Call"
        fullWidth
        onPress={() => setVisible(true)}
      />
      {!!network && (
        <GnoCallModal isVisible={isVisible} onClose={() => setVisible(false)} />
      )}
    </>
  );
};

interface GnoCallModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const GnoCallModal = ({ isVisible, onClose }: GnoCallModalProps) => {
  const ModalHeader = useCallback(
    () => (
      <View style={headerStyle}>
        <BrandText>Yolo</BrandText>
      </View>
    ),
    [],
  );
  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      Header={ModalHeader}
      width={456}
    >
      <BrandText>hello</BrandText>
    </ModalBase>
  );
};

const headerStyle: ViewStyle = {
  display: "flex",
  alignItems: "center",
  width: "auto",
};
