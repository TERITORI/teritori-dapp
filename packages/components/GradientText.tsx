import { TextStyle } from "react-native";

import { BrandText } from "./BrandText";

export const GradientText: React.FC<{ style: TextStyle }> = ({
  children,
  style,
}) => (
  <BrandText
    style={[
      {
        backgroundImage:
          "linear-gradient(90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      } as any,
      style,
    ]}
  >
    {children}
  </BrandText>
);
