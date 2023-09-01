import { coin } from "@cosmjs/amino";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";

import {
  BreedingResultModal,
  TokenInfo,
} from "./component/BreedingResultModal";
import { BreedingSlot } from "./component/BreedingSlot";
import { GameContentView } from "./component/GameContentView";
import { InfoBox } from "./component/InfoBox";
import { RipperSelectorModal } from "./component/RipperSelectorModal";
import breedSVG from "../../../assets/game/breed.svg";
import chevronDownLineSVG from "../../../assets/game/chevron-down-line.svg";
import { NFT } from "../../api/marketplace/v1/marketplace";
import { BrandText } from "../../components/BrandText";
import { ExternalLink } from "../../components/ExternalLink";
import FlexRow from "../../components/FlexRow";
import { SVG } from "../../components/SVG";
import { PrimaryButtonOutline } from "../../components/buttons/PrimaryButtonOutline";
import { LoaderFullScreen } from "../../components/loaders/LoaderFullScreen";
import { SpacerRow } from "../../components/spacer";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { ConfigResponse } from "../../contracts-clients/teritori-breeding/TeritoriBreeding.types";
import { useBreeding } from "../../hooks/riotGame/useBreeding";
import { useRippers } from "../../hooks/riotGame/useRippers";
import { useSelectedNetworkId } from "../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { NetworkKind, getCollectionId, parseNftId } from "../../networks";
import { prettyPrice } from "../../utils/coins";
import { getRipperTokenId } from "../../utils/game";
import { neutral33, neutralA3, yellowDefault } from "../../utils/style/colors";
import { fontMedium14, fontMedium48 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";

export const RiotGameBreedingScreen = () => {
  const { myAvailableRippers } = useRippers();
  const [isShowBreedingResultModal, setIsShowBreedingResultModal] =
    useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number>();
  const [isBreeding, setIsBreeding] = useState(false);
  const { setToastError } = useFeedbacks();
  const [newTokenInfo, setNewTokenInfo] = useState<TokenInfo>();
  const selectedNetworkId = useSelectedNetworkId();

  const [selectedRippers, setSelectedRippers] = useState<{
    [slotId: string]: {
      ripper: NFT;
      breedingsLeft: number;
    };
  }>({});

  const selectedWallet = useSelectedWallet();

  const {
    breedingConfig,
    breed,
    remainingTokens,
    getChildTokenIds,
    getTokenInfo,
    fetchRemainingTokens,
  } = useBreeding(selectedNetworkId);

  const intervalRef = useRef<NodeJS.Timer>();

  const availableForBreedRippers = useMemo(() => {
    // Only original Rioter can breed
    const selectedIds = Object.values(selectedRippers).map((r) => r.ripper.id);

    return myAvailableRippers.filter((r) => {
      if (selectedIds.includes(r.id)) {
        return false;
      }

      const [network, collectionAddress] = parseNftId(r.id);

      if (network?.kind !== NetworkKind.Cosmos) {
        return false;
      }
      const collectionId = getCollectionId(network?.id, collectionAddress);
      if (!collectionId) {
        return false;
      }

      const gen0CollectionId = getCollectionId(
        network?.id,
        network.riotContractAddressGen0
      );
      if (!gen0CollectionId) {
        return false;
      }

      return collectionId === gen0CollectionId;
    });
  }, [myAvailableRippers, selectedRippers]);

  /**
   * NOTE: The current contract does not allow to get the newly created NFT,
   * so we have to fetch the new NFT every 2s and show only info if we have
   */
  const fetchNewToken = async (
    currentChildTokenIds: string[],
    owner: string,
    breedingConfig: ConfigResponse
  ) => {
    const updatedTokens = await getChildTokenIds(
      owner,
      breedingConfig.child_contract_addr
    );
    const newTokenIds = updatedTokens.filter(
      (id: string) => !(currentChildTokenIds || []).includes(id)
    );

    const newTokenId = newTokenIds[0];

    if (!newTokenId) {
      return;
    }

    intervalRef.current && clearInterval(intervalRef.current);
    const newTokenInfo = await getTokenInfo(
      newTokenId,
      breedingConfig.child_contract_addr
    );

    setNewTokenInfo(newTokenInfo);
    setIsBreeding(false);
    setIsShowBreedingResultModal(true);
    fetchRemainingTokens(breedingConfig);
  };

  const doBreed = async () => {
    if (!breedingConfig) {
      return setToastError({
        title: "Error",
        message: "Failed to load BreedingConfig",
      });
    }

    if (!selectedWallet?.address) {
      return setToastError({
        title: "Error",
        message: "Login is required",
      });
    }

    if (!selectedRippers[0] || !selectedRippers[1]) {
      return setToastError({
        title: "Error",
        message: "Not enough rippers selected",
      });
    }

    setIsBreeding(true);

    const currentChildTokenIds = await getChildTokenIds(
      selectedWallet.address,
      breedingConfig.child_contract_addr
    );

    try {
      await breed(
        coin(
          breedingConfig.breed_price_amount,
          breedingConfig.breed_price_denom
        ),
        breedingConfig.breed_duration,
        getRipperTokenId(selectedRippers[0].ripper),
        getRipperTokenId(selectedRippers[1].ripper),
        breedingConfig.parent_contract_addr
      );

      intervalRef.current = setInterval(
        () =>
          fetchNewToken(
            currentChildTokenIds,
            selectedWallet.address,
            breedingConfig
          ),
        2000
      );
    } catch (e) {
      setIsBreeding(false);
      console.error(e);
      if (e instanceof Error) {
        setToastError({
          title: "Error occurs",
          message: e.message,
        });
      }
      setIsBreeding(false);
    }
  };

  const openSelectorModal = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  const selectRipper = (slotId: number, ripper: NFT, breedingsLeft: number) => {
    setSelectedSlot(undefined);
    setSelectedRippers({
      ...selectedRippers,
      [slotId]: {
        ripper,
        breedingsLeft,
      },
    });
  };

  useEffect(() => {
    return () => {
      intervalRef.current && clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <GameContentView>
      <LoaderFullScreen visible={isBreeding} />

      <View
        style={{
          marginTop: layout.spacing_x4,
          alignItems: "center",
          alignSelf: "center",
        }}
      >
        <BrandText style={[fontMedium48]}>Breeding</BrandText>

        <FlexRow
          style={{ justifyContent: "center", marginTop: layout.spacing_x4 }}
        >
          <BreedingSlot
            ripper={selectedRippers[0]?.ripper}
            breedingsLeft={selectedRippers[0]?.breedingsLeft}
            onPress={() => openSelectorModal(0)}
          />
          <SpacerRow size={3} />
          <BreedingSlot
            ripper={selectedRippers[1]?.ripper}
            breedingsLeft={selectedRippers[1]?.breedingsLeft}
            onPress={() => openSelectorModal(1)}
          />
        </FlexRow>

        <FlexRow style={{ marginTop: layout.spacing_x4 }}>
          <InfoBox
            size="LG"
            title="Price"
            content={prettyPrice(
              selectedWallet?.networkId || "",
              breedingConfig?.breed_price_amount || "",
              breedingConfig?.breed_price_denom || ""
            )}
            width={180}
          />
          <InfoBox
            size="LG"
            title="Remaining NFTs"
            content={`${remainingTokens}`}
            width={180}
          />

          <InfoBox size="LG" title="Bonus" content="Coming soon" width={180} />
        </FlexRow>

        <View style={{ marginTop: layout.spacing_x2 }}>
          <SVG source={chevronDownLineSVG} color={neutral33} />
        </View>

        <PrimaryButtonOutline
          disabled={isBreeding || Object.keys(selectedRippers).length !== 2}
          onPress={doBreed}
          color={yellowDefault}
          size="M"
          text={isBreeding ? "Breeding..." : "Breed my Rippers"}
          iconSVG={breedSVG}
          touchableStyle={{ marginTop: layout.spacing_x2 }}
        />

        <FlexRow
          width="auto"
          alignItems="center"
          style={{ marginTop: layout.spacing_x2 }}
        >
          <BrandText style={[fontMedium14, { color: neutralA3 }]}>
            By clicking "Breed my Rippers" you agree to this
          </BrandText>
          <SpacerRow size={1} />
          <ExternalLink
            style={fontMedium14}
            externalUrl="https://teritori.notion.site/The-R-ot-Terms-Conditions-Breeding-1ea3729d50484a0dbe3c55f6ec5ae3e2"
          >
            Terms & Conditions
          </ExternalLink>
        </FlexRow>
      </View>

      <RipperSelectorModal
        visible={selectedSlot !== undefined}
        confirmButton="Add to Breeding"
        slotId={selectedSlot}
        availableRippers={availableForBreedRippers}
        onSelectRipper={selectRipper}
        onClose={() => setSelectedSlot(undefined)}
      />

      <BreedingResultModal
        tokenInfo={newTokenInfo}
        onClose={() => {
          setIsShowBreedingResultModal(false);
          setSelectedRippers({});
          setNewTokenInfo(undefined);
        }}
        visible={isShowBreedingResultModal}
      />
    </GameContentView>
  );
};
