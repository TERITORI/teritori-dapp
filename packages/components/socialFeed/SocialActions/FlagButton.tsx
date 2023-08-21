import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { FlagConfirmModal } from "./FlagConfirmModal";
import { FlagConfirmedModal } from "./FlagConfirmedModal";
import { FlagDetailsModal } from "./FlagDetailsModal";
import { FlagModal } from "./FlagModal";
import flagSVG from "../../../../assets/icons/flag.svg";
import { NetworkInfo } from "../../../networks";
import { SVG } from "../../SVG";

type FlagButtonProps = {
  networkInfo: NetworkInfo;
  postId: string;
};

export const FlagButton: React.FC<FlagButtonProps> = ({
  networkInfo,
  postId,
}) => {
  const [isShowFlagModal, setIsShowFlagModal] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsShowFlagModal(true)}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <SVG source={flagSVG} width={24} height={24} />
      </TouchableOpacity>

      <FlagModal
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagModal(false);
        }}
        isVisible={isShowFlagModal}
      />
    </>
  );
};
