import { coin } from "cosmwasm";
import React, { useMemo, useState } from "react";
import { View } from "react-native";

import breedSVG from "../../../assets/game/breed.svg";
import chevronDownLineSVG from "../../../assets/game/chevron-down-line.svg";
import { BrandText } from "../../components/BrandText";
import { SVG } from "../../components/SVG";
import { ButtonOutline } from "../../components/buttons/ButtonOutline";
import Row from "../../components/grid/Row";
import { SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { useBreeding } from "../../hooks/riotGame/useBreeding";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { prettyPrice } from "../../utils/coins";
import { getRipperTokenId } from "../../utils/game";
import { neutral33, neutralA3, yellowDefault } from "../../utils/style/colors";
import { flex } from "../../utils/style/flex";
import { fontMedium14, fontMedium48 } from "../../utils/style/fonts";
import { spacing } from "../../utils/style/spacing";
import { BreedingResultModal } from "./component/BreedingResultModal";
import { BreedingSlot } from "./component/BreedingSlot";
import { GameContentView } from "./component/GameContentView";
import { InfoBox } from "./component/InfoBox";
import { RipperSelectorModal } from "./component/RipperSelectorModal";

export const RiotGameBreedingScreen = () => {
  const { myAvailableRippers } = useRippers();
  const [isShowBreedingResultModal, setIsShowBreedingResultModal] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [isBreeding, setIsBreeding] = useState(false);
  const { setToastError } = useFeedbacks();

  const [selectedRippers, setSelectedRippers] = useState<{
    [slotId: string]: NSRiotGame.RipperDetail;
  }>({});

  const { breedingConfig, breed } = useBreeding();

  const availableRippers = useMemo(() => {
    const selectedIds = Object.values(selectedRippers).map((r) => r.tokenId);

    const res = myAvailableRippers.filter(
      (r) => !selectedIds.includes(getRipperTokenId(r))
    );

    return res;
  }, [myAvailableRippers, selectedRippers]);

  const doBreed = async () => {
    setIsBreeding(true);

    try {
      const result = await breed(
        coin(
          breedingConfig?.breed_price_amount || "",
          breedingConfig?.breed_price_denom || ""
        ),
        selectedRippers[0]?.tokenId,
        selectedRippers[1]?.tokenId
      );

      console.log(result);
      /**
       * 
       * {
    "code": 0,
    "height": 2174253,
    "rawLog": "[{\"events\":[{\"type\":\"execute\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmwasm.wasm.v1.MsgExecuteContract\"},{\"key\":\"module\",\"value\":\"wasm\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"}]},{\"type\":\"wasm\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"},{\"key\":\"action\",\"value\":\"approve\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"},{\"key\":\"spender\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"token_id\",\"value\":\"608\"}]}]},{\"msg_index\":1,\"events\":[{\"type\":\"execute\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmwasm.wasm.v1.MsgExecuteContract\"},{\"key\":\"module\",\"value\":\"wasm\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"}]},{\"type\":\"wasm\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"},{\"key\":\"action\",\"value\":\"approve\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"},{\"key\":\"spender\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"token_id\",\"value\":\"560\"}]}]},{\"msg_index\":2,\"events\":[{\"type\":\"coin_received\",\"attributes\":[{\"key\":\"receiver\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"amount\",\"value\":\"1000000utori\"}]},{\"type\":\"coin_spent\",\"attributes\":[{\"key\":\"spender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"},{\"key\":\"amount\",\"value\":\"1000000utori\"}]},{\"type\":\"execute\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"},{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"}]},{\"type\":\"message\",\"attributes\":[{\"key\":\"action\",\"value\":\"/cosmwasm.wasm.v1.MsgExecuteContract\"},{\"key\":\"module\",\"value\":\"wasm\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"}]},{\"type\":\"transfer\",\"attributes\":[{\"key\":\"recipient\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"sender\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"},{\"key\":\"amount\",\"value\":\"1000000utori\"}]},{\"type\":\"wasm\",\"attributes\":[{\"key\":\"_contract_address\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"action\",\"value\":\"breed\"},{\"key\":\"user\",\"value\":\"tori19cnu30yq5s52f00xc430ktyjz35nw24jx8zplc\"},{\"key\":\"nft_token_id1\",\"value\":\"608\"},{\"key\":\"nft_token_id2\",\"value\":\"560\"},{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"},{\"key\":\"action\",\"value\":\"transfer_nft\"},{\"key\":\"recipient\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"sender\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"token_id\",\"value\":\"608\"},{\"key\":\"_contract_address\",\"value\":\"tori1v9lx2dk6cuj9qu44pv8s4rfl8retj5nzhj89vrtlhzwed7c4cnxq3yhjtw\"},{\"key\":\"action\",\"value\":\"transfer_nft\"},{\"key\":\"recipient\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"sender\",\"value\":\"tori1f24mduf66wx26qsaqy6xpnn6f0knphvh82hpedy5kqp9892puvpsc5eekc\"},{\"key\":\"token_id\",\"value\":\"560\"}]}]}]",
    "transactionHash": "F97FCDB3190B9707906D42D9EF9B6A424E78711ABCDD66C2F14AA573C077FAEC",
    "gasUsed": 629013,
    "gasWanted": 799156
}
       */

      setIsShowBreedingResultModal(true);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setToastError({
          title: "Error occurs",
          message: e.message,
        });
      }
    } finally {
      setIsBreeding(false);
    }
  };

  const openSelectorModal = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const selectRipper = (slotId: number, ripper: NSRiotGame.RipperDetail) => {
    setSelectedSlot(undefined);
    setSelectedRippers({ ...selectedRippers, [slotId]: ripper });
  };

  // if (!isSquadLoaded && !isStakingStateLoaded) {
  //   return (
  //     <GameContentView>
  //       <BrandText style={styles.pageTitle}>Loading...</BrandText>
  //     </GameContentView>
  //   );
  // }

  return (
    <GameContentView>
      <View style={[spacing.mt_5, flex.alignCenter]}>
        <BrandText style={[fontMedium48]}>Breeding</BrandText>

        <Row style={[spacing.mt_5, flex.justifyContentCenter]}>
          <BreedingSlot
            ripper={selectedRippers[0]}
            onPress={() => openSelectorModal(0)}
          />
          <SpacerRow size={3} />
          <BreedingSlot
            ripper={selectedRippers[1]}
            onPress={() => openSelectorModal(1)}
          />
        </Row>

        <Row style={spacing.mt_5}>
          <InfoBox
            size="LG"
            title="Price"
            content={prettyPrice(
              process.env.TERITORI_NETWORK_ID || "",
              breedingConfig?.breed_price_amount || "",
              breedingConfig?.breed_price_denom || ""
            )}
            width={180}
          />
          <InfoBox
            size="LG"
            title="Breeding Cooldown"
            content="00:00 AM"
            width={180}
          />

          <InfoBox size="LG" title="Bonus" content="Coming soon" width={180} />
        </Row>

        <View style={spacing.mt_2}>
          <SVG source={chevronDownLineSVG} color={neutral33} />
        </View>

        <ButtonOutline
          disabled={isBreeding || Object.keys(selectedRippers).length !== 2}
          onPress={doBreed}
          color={yellowDefault}
          size="M"
          text={isBreeding ? "Breeding..." : "Breed my Rippers"}
          iconSVG={breedSVG}
          style={spacing.mt_2}
        />

        <BrandText style={[fontMedium14, spacing.mt_2, { color: neutralA3 }]}>
          Legal phrase powered by Popipou
        </BrandText>
      </View>

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        confirmButton="Add to Breeding"
        slotId={selectedSlot}
        availableRippers={availableRippers}
        onSelectRipper={selectRipper}
        onClose={() => setSelectedSlot(undefined)}
      />

      <BreedingResultModal
        onClose={() => setIsShowBreedingResultModal(false)}
        visible={isShowBreedingResultModal}
      />
    </GameContentView>
  );
};
