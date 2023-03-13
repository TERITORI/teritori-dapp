import { useEffect, useState } from "react";
import { StyleSheet, View, ViewStyle, useWindowDimensions } from "react-native";

import {
  CurrentSeasonResponse,
  UserRankResponse,
} from "../../../api/p2e/v1/p2e";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { useFeedbacks } from "../../../context/FeedbacksProvider";
import {
  TeritoriDistributorQueryClient,
  TeritoriDistributorClient,
} from "../../../contracts-clients/teritori-distributor/TeritoriDistributor.client";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { p2eBackendClient } from "../../../utils/backend";
import { decimalFromAtomics } from "../../../utils/coins";
import { TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS } from "../../../utils/game";
import {
  getNonSigningCosmWasmClient,
  getSigningCosmWasmClient,
} from "../../../utils/keplr";
import { yellowDefault } from "../../../utils/style/colors";
import {
  layout,
  mobileWidth,
  smallMobileWidth,
} from "../../../utils/style/layout";
import { InfoBox } from "./InfoBox";

type FightStatsSectionProps = {
  containerStyle?: ViewStyle;
};

export const FightStatsSection: React.FC<FightStatsSectionProps> = ({
  containerStyle,
}) => {
  const selectedWallet = useSelectedWallet();
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [userRank, setUserRank] = useState<UserRankResponse>();
  const { setToastError, setToastSuccess } = useFeedbacks();
  const [isClaiming, setIsClaiming] = useState(false);
  const [currentSeason, setCurrentSeason] = useState<CurrentSeasonResponse>();

  const { width } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flexDirection: width < mobileWidth ? "column" : "row",
      margin: layout.padding_x1_5,
      alignItems: "center",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const claimRewards = async (user: string) => {
    setIsClaiming(true);

    try {
      const signingClient = await getSigningCosmWasmClient();
      const distributorClient = new TeritoriDistributorClient(
        signingClient,
        user,
        TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
      );

      await distributorClient.claim();
      setToastSuccess({
        title: "Success",
        message: "Your rewards have been sent to your wallet",
      });
      setClaimableAmount(0);
    } catch (e: any) {
      setToastError({ title: "Error", message: e.message });
    } finally {
      setIsClaiming(false);
    }
  };

  const fetchCurrentSeason = async () => {
    const currentSeason = await p2eBackendClient.CurrentSeason({});
    setCurrentSeason(currentSeason);
  };

  const fetchUserRank = async (userId: string, seasonId: string) => {
    try {
      const userRank = await p2eBackendClient.UserRank({
        seasonId,
        userId,
      });

      setUserRank(userRank);
    } catch (e) {
      console.log("Unable to fetch rank:", e);
    }
  };

  const fetchClaimableAmount = async (user: string) => {
    const nonSigningClient = await getNonSigningCosmWasmClient();
    const distributorQueryClient = new TeritoriDistributorQueryClient(
      nonSigningClient,
      TERITORI_DISTRIBUTOR_CONTRACT_ADDRESS
    );

    const claimableAmount = await distributorQueryClient.userClaimable({
      addr: user,
    });

    setClaimableAmount(+claimableAmount);
  };

  useEffect(() => {
    if (!currentSeason?.id || !selectedWallet?.address) return;

    fetchUserRank(selectedWallet.address, currentSeason.id);
  }, [selectedWallet?.address, currentSeason?.id]);

  useEffect(() => {
    if (!selectedWallet?.address) return;

    fetchClaimableAmount(selectedWallet.address);
  }, [selectedWallet?.address]);

  useEffect(() => {
    fetchCurrentSeason();
  }, []);

  return (
    <View style={[containerStyle, styles.container]}>
      <View
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <InfoBox
          size={width < smallMobileWidth ? "XS" : "SM"}
          title="Number of Fighters"
          content={`${userRank?.totalUsers || 0} Rippers`}
          width={width < smallMobileWidth ? 110 : 120}
        />
        <InfoBox
          size={width < smallMobileWidth ? "XS" : "SM"}
          // size="SM"
          title="Prize Pool"
          content={`${currentSeason?.isPre ? 0 : currentSeason?.totalPrize} ${
            currentSeason?.denom.toUpperCase() || ""
          }`}
          width={width < smallMobileWidth ? 100 : 150}
        />
        <InfoBox
          // size="SM"
          size={width < smallMobileWidth ? "XS" : "SM"}
          title="Rank"
          content={`${userRank?.userScore?.rank || 0}/${
            userRank?.totalUsers || 0
          }`}
          width={width < smallMobileWidth ? 80 : 120}
        />
      </View>
      {/* {claimableAmount !== 0 && selectedWallet?.address && ( */}
      {1 && (
        <PrimaryButtonOutline
          disabled={isClaiming}
          color={yellowDefault}
          size="M"
          text={
            isClaiming
              ? "Claiming..."
              : `Claim available rewards: ${decimalFromAtomics(
                  process.env.TERITORI_NETWORK_ID || "",
                  "" + claimableAmount,
                  "utori"
                )} TORI`
          }
          style={{
            marginLeft: layout.padding_x1,
            width: width < mobileWidth ? "90%" : "",
            marginTop: width < mobileWidth ? 10 : 0,
          }}
          // onPress={() => claimRewards(selectedWallet.address)}
          noBrokenCorners
        />
      )}
    </View>
  );
};
