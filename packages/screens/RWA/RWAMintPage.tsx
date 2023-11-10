import React from "react";

import { getEstateCardById } from "./components/EstateCard/EstateCardList";
import { RWAScreenContainer } from "./components/RWAScreenContainer/RWAScreenContainer";
import { setIsLightTheme } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { ScreenFC, useAppNavigation } from "../../utils/navigation";

export const RWAMintPage: ScreenFC<"RWAMintPage"> = ({
  route: {
    params: { id },
  },
}) => {
  const dispatch = useAppDispatch();
  const { goBack } = useAppNavigation();
  const { tags, card } = getEstateCardById(id);

  React.useEffect(() => {
    dispatch(setIsLightTheme(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RWAScreenContainer onBackPress={goBack} headerTitle={card?.title || ""}>
      <></>
    </RWAScreenContainer>
  );
};
