import { View } from "react-native";

import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Disconnect = () => {
  const { isMinimunWindowWidth } = useContentContext();

  const styleTypeSize = isMinimunWindowWidth ? "80" : "40";
  return (
    <View
      style={{
        height: "34vh",
        justifyContent: "flex-end",
      }}
    >
      <Label
        styleType={`H1_Bebas_${styleTypeSize}`}
        style={{ textAlign: "center", color: "#E8E1EF" }}
      >
        Punks, you want to disconnect
      </Label>
      <Label
        styleType="H2_DHBS_80"
        style={{
          textAlign: "center",
          color: "#FFD753",
          transform: [{ rotate: "-1.69deg" }],
        }}
      >
        ???
      </Label>
      <View
        style={{
          marginTop: "5em",
          flexDirection: "row",
          flexWrap: "nowrap",
          justifyContent: "center",
        }}
      >
        <ButtonLabel
          text="YES"
          size="S"
          style={{
            marginRight: "2em",
          }}
          actionable
          onPress={() => {
            debugger;
          }}
        />
        <ButtonLabel
          text="NO"
          size="S"
          actionable
          onPress={() => {
            debugger;
          }}
        />
      </View>
    </View>
  );
};
