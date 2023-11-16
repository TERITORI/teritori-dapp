import { SvgProps } from "react-native-svg";

import { useDynamicSvgImport } from "../../../hooks/freelance/useDynamicSvgImport";
import { BrandText } from "../../BrandText";

type SvgIconProps = {
  source: string;
};
export const SvgIcon: React.FC<SvgProps & SvgIconProps> = ({
  source,
  ...svgProps
}) => {
  const { loading, SvgComponent } = useDynamicSvgImport(source);
  return (
    <>
      {loading && <BrandText>Loading Icon</BrandText>}
      {SvgComponent && <SvgComponent {...svgProps} />}
    </>
  );
};
