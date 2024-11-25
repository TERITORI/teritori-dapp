import React, { FC } from "react";
import { useWindowDimensions } from "react-native";

import { SearchBarInputGlobal } from "./SearchBarInput";
import { SearchBarResults } from "./SearchBarResults";
import ModalBase from "../modals/ModalBase";
export const SearchModalMobile: FC<{
  onClose: () => void;
  visible?: boolean;
}> = ({ onClose, visible }) => {
  const { width: windowWidth } = useWindowDimensions();

  return (
    <ModalBase
      scrollable
      verticalPosition="top"
      visible={visible}
      onClose={onClose}
      width={windowWidth}
      labelComponent={<SearchBarInputGlobal style={{ alignSelf: "center" }} />}
      hideMainSeparator
      childrenContainerStyle={{ paddingHorizontal: 0 }}
      closeButtonStyle={{ alignSelf: "center", marginLeft: 0 }}
    >
      <SearchBarResults />
    </ModalBase>
  );
};
