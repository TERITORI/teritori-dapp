import { Image, ImageSourcePropType, View, ViewStyle } from "react-native";

type RipperAvatarProps = {
  size: number;
  source: ImageSourcePropType;
  containerStyle?: ViewStyle;
  rounded?: boolean;
};

const RipperAvatar: React.FC<RipperAvatarProps> = ({
  size,
  source,
  rounded = false,
  containerStyle,
}) => {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: rounded ? Math.floor(size / 2) : 0,
          overflow: "hidden",
        },
        containerStyle,
      ]}
    >
      <Image style={{ width: "100%", height: "100%" }} source={source} />
    </View>
  );
};

export default RipperAvatar;
