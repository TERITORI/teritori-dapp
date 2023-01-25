import {LinearGradient} from "expo-linear-gradient";
import {StyleProp, ViewStyle} from "react-native";

export const InnerSideBlackShadow: React.FC<{
  side: "left"|"right";
  height: number;
  style?: StyleProp<ViewStyle>
}> = ({height, side, style, children}) => {
  return (
    <LinearGradient
      start={{ x: 0, y: .5 }}
      end={{ x: 1, y: .5 }}
      colors={
        side === "left" ? ["rgba(0,0,0,1)", "rgba(0,0,0,.8)","rgba(0,0,0,.0)"]
          : ["rgba(0,0,0,.0)", "rgba(0,0,0,.8)", "rgba(0,0,0,1)"]
      }
      style={[
        {
          height: height,
          width: 44,
        }, style]
      }
    >
      {children}
    </LinearGradient>
  )
}
