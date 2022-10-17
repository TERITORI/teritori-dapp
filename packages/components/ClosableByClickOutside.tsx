import React from "react";
import { Menu } from "react-native-material-menu";

import { layout } from "../utils/style/layout";

export const ClosableByClickOutside: React.FC<{
  visible?: boolean;
  close: () => void;
}> = ({ visible = false, close, children }) => {
  return (
    <Menu
      style={{ backgroundColor: "none", marginTop: layout.padding_x0_5 }}
      visible={visible}
      onRequestClose={close}
    >
      {children}
    </Menu>
  );
};
