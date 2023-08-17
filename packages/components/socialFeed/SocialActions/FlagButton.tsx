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
  const [isShowFlagConfirmModal, setIsShowFlagConfirmModal] = useState(false);
  const [isShowFlagConfirmedModal, setIsShowFlagConfirmedModal] =
    useState(false);
  const [isShowFlagDetailsModal, setIsShowFlagDetailsModal] = useState(false);

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
          nextModalName === "FlagConfirmModal" &&
            setIsShowFlagConfirmModal(true);
        }}
        isVisible={isShowFlagModal}
      />

      <FlagConfirmModal
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagConfirmModal(false);
          nextModalName === "FlagConfirmedModal" &&
            setIsShowFlagConfirmedModal(true);
        }}
        isVisible={isShowFlagConfirmModal}
      />

      <FlagConfirmedModal
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagConfirmedModal(false);
          nextModalName === "FlagDetailsModal" &&
            setIsShowFlagDetailsModal(true);
        }}
        isVisible={isShowFlagConfirmedModal}
      />

      <FlagDetailsModal
        postId={postId}
        onClose={(nextModalName) => {
          setIsShowFlagDetailsModal(false);
        }}
        isVisible={isShowFlagDetailsModal}
      />
    </>
  );
};
