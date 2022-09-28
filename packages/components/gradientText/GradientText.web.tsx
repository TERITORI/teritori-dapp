import { TextStyle } from "react-native";

export const GradientText: React.FC<{ style: TextStyle }> = ({ children }) => (
  <p
    style={{
      backgroundImage:
        "linear-gradient(90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    {children}
  </p>
);
