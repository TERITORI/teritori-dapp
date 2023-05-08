import { View } from "react-native";

import { setIsKeplrConnected } from "../../../../../store/slices/settings";
import { useAppDispatch } from "../../../../../store/store";
import { ButtonLabel } from "../components/buttonLabel/ButtonLabel";
import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Disconnect = () => {
  const { isMinimunWindowWidth, setSelectedSectionHandler } =
    useContentContext();
  const dispatch = useAppDispatch();

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
            dispatch(setIsKeplrConnected(false));
          }}
        />
        <ButtonLabel
          text="NO"
          size="S"
          actionable
          onPress={() => {
            setSelectedSectionHandler("lottery");
          }}
        />
      </View>
    </View>
  );
};
