import { View } from "react-native";

import { Label } from "../components/label/Label";
import { useContentContext } from "../context/ContentProvider";

export const Raffle = () => {
  const { isMinimunWindowWidth } = useContentContext();
  return (
    <View
      // @ts-expect-error
      style={{
        height: isMinimunWindowWidth ? "56vh" : "40vh",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: isMinimunWindowWidth ? 0 : 18,
        marginTop: isMinimunWindowWidth ? "6vh" : "none",
      }}
    >
      <Label
        styleType="T2_Bebas_50"
        style={{ textAlign: "center", color: "#E8E1EF" }}
      >
        Cosmos save the punks, long live the toripunks
      </Label>
      <Label
        styleType="H2_DHBS_80"
        style={{
          textAlign: "center",
          color: "rgba(31, 32, 16, 0.4)",
          transform: [{ rotate: "-1.69deg" }],
        }}
      >
        Be patient
      </Label>
    </View>
  );
};
