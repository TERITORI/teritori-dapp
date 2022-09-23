import styled from "styled-components/native";

import { BrandText } from "./BrandText";

export const GradientText = styled(BrandText)({
  // web only
  backgroundImage:
    "linear-gradient(90deg, #5433FF 0%, #20BDFF 50%, #A5FECB 100%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});
