import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";

import { useContentContext } from "../../context/ContentProvider";

export const ActionButton = ({
  text,
  reduceHandler,
  addHandler,
  result = false,
  textWinning = 0,
  textLosing = 0,
}: {
  text: number;
  textWinning?: number;
  textLosing?: number;
  reduceHandler: () => void;
  addHandler: () => void;
  result: boolean;
}) => {
  const contentContext = useContentContext();

  const resultCss = {
    backgroundColor: "#212708",
    width: 242,
    borderRadius: 5,
    justifyContent: "center",
    height: 150,
    alignItems: "center",
  };

  const titleCss = {
    ...contentContext.styles["T1_Bebas_20"],
    ...{ color: "#E8E1EF", lineHeight: "normal" },
  };

  const resultTextCss = {
    ...contentContext.styles["H1_Bebas_80"],
    ...{ color: "#E8E1EF" },
  };

  return (
    <View
      style={[
        {
          height: result ? 150 : 100,
          marginBottom: 10,
          justifyContent: "center",
        },
      ]}
    >
      {result ? (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={resultCss as StyleProp<ViewStyle>}>
            <Text style={titleCss}>Winning tickets</Text>
            <Text style={resultTextCss}>{textWinning}</Text>
          </View>
          <View style={resultCss as StyleProp<ViewStyle>}>
            <Text style={titleCss}>Loosing tickets</Text>
            <Text style={resultTextCss}>{textLosing}</Text>
          </View>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#212708",
            borderRadius: 5,
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <TouchableOpacity
            onPress={reduceHandler}
            disabled={text < 1}
            style={{
              opacity: text < 1 ? 0.5 : 1,
            }}
          >
            <Image
              source={require("../../assets/minus.png")}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
          <Text
            style={[contentContext.styles["H1_Bebas_80"], { color: "#E8E1EF" }]}
          >
            {text}
          </Text>
          <TouchableOpacity
            onPress={addHandler}
            disabled={text >= 10}
            style={{
              opacity: text >= 10 ? 0.5 : 1,
            }}
          >
            <Image
              source={require("../../assets/plus.png")}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
