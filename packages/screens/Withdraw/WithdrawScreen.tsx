import React from "react";

import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { TeritoriBunkerMinterClient } from "../../contracts-clients/teritori-bunker-minter/TeritoriBunkerMinter.client";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { getSigningCosmWasmClient } from "../../utils/keplr";
import { ScreenFC } from "../../utils/navigation";

export const WithdrawScreen: ScreenFC<"WithdrawBunker"> = ({
  route: {
    params: { id },
  },
}) => {
  const { setToastError, setToastSuccess } = useFeedbacks();
  const selectedWallet = useSelectedWallet();

  return (
    <ScreenContainer smallMargin footerChildren={<></>}>
      <PrimaryButton
        size="XL"
        text="Proceder à retirer la moula"
        loader
        onPress={async () => {
          try {
            const cosmwasmClient = await getSigningCosmWasmClient();
            const bunkerClient = new TeritoriBunkerMinterClient(
              cosmwasmClient,
              selectedWallet?.address || "",
              id
            );
            await bunkerClient.withdrawFund();
            setToastSuccess({ title: "Teritori FTW", message: "" });
          } catch (err) {
            console.error(err);
            if (err instanceof Error) {
              setToastError({ title: "Sad story bro", message: err.message });
            }
          }
        }}
      />
    </ScreenContainer>
  );
};
