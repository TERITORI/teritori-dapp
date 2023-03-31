import React, { FC } from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
interface CardProps {
  icon: React.ReactNode;
  text: string;
  subtext: string;
  containerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<ViewStyle>;
}

const MessageCard: FC<CardProps> = ({
  icon,
  text,
  containerStyle,
  iconStyle,
  textStyle,
  subtext,
}) => {
  const SVG: any = icon;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.iconContainer, iconStyle]}>
        <SVG source={icon} height={30} width={30} />
      </View>
      <Text style={[styles.text, textStyle]}>{text}</Text>
      <Text style={[styles.subtext, textStyle]}>{subtext}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#000000",
    elevation: 2,
    borderColor: "#171717",
    borderWidth: 1,
    marginRight: 20,
  },
  iconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    lineHeight: 21,
  },
  subtext: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    lineHeight: 21,
    marginLeft: 10,
  },
});

export default MessageCard;
