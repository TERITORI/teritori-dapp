import { useMemo } from "react";
import { ModalProps } from "react-native";

import { RipperStat } from "./RipperStat";
import { NFT } from "../../../api/marketplace/v1/marketplace";
import { getRipperTraitValue } from "../../../utils/game";
import { layout } from "../../../utils/style/layout";

type RipperStatsSectionProps = ModalProps & {
  breedingsLeft?: number | undefined;
  ripper: NFT | undefined;
  size: "MD" | "LG";
};

export const RipperStatsSection: React.FC<RipperStatsSectionProps> = ({
  breedingsLeft,
  ripper,
  size,
}) => {
  const marginTop = useMemo(() => {
    let _marginTop;
    switch (size) {
      case "LG":
        _marginTop = layout.spacing_x4;
        break;
      case "MD":
      default:
        _marginTop = layout.spacing_x3;
    }
    return _marginTop;
  }, [size]);

  return (
    <>
      <RipperStat
        containerStyle={{ marginTop }}
        name="Stamina"
        value={ripper && getRipperTraitValue(ripper, "Stamina")}
        size={size}
      />
      <RipperStat
        containerStyle={{ marginTop }}
        name="Protection"
        value={ripper && getRipperTraitValue(ripper, "Protection")}
        size={size}
      />
      <RipperStat
        containerStyle={{ marginTop }}
        name="Luck"
        value={ripper && getRipperTraitValue(ripper, "Luck")}
        size={size}
      />

      {breedingsLeft !== undefined && (
        <RipperStat
          containerStyle={{ marginTop }}
          name="Breedings left"
          showProgress={false}
          value={breedingsLeft}
          size={size}
        />
      )}
    </>
  );
};
