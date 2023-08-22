import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import { FlagModal } from "./FlagModal";
import flagSVG from "../../../../assets/icons/flag.svg";
import { SVG } from "../../SVG";

type FlagButtonProps = {
  refetchFeed?: () => Promise<any>;
  postId: string;
};

export const FlagButton: React.FC<FlagButtonProps> = ({
  refetchFeed,
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
        refetchFeed={refetchFeed}
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagModal(false);
        }}
        isVisible={isShowFlagModal}
      />
    </>
  );
};
