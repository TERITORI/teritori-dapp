import { Link as NativeLink } from "@react-navigation/native";
import React, { useCallback } from "react";
import { Linking, TouchableOpacity } from "react-native";

import { LinkProps } from "./types";

// FIXME: use <a> tag on web

export const Link: React.FC<LinkProps> = ({ to, children, style }) => {
  const handleExternal = useCallback(() => {
    return Linking.openURL(to || "");
  }, [to]);

  if ((to || "").startsWith("/")) {
    return <NativeLink to={to || ""}>{children}</NativeLink>;
  }

  return (
    <TouchableOpacity style={style} onPress={handleExternal}>
      {children}
    </TouchableOpacity>
  );
};
