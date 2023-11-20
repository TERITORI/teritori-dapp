import Clipboard from "@react-native-clipboard/clipboard";
import React, { useMemo, useState } from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";
import { CheckCircleIcon } from "react-native-heroicons/outline";

import copySVG from "../../../assets/icons/copy.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import { BrandText } from "../../components/BrandText";
import { Menu } from "../../components/Menu";
import { SVG } from "../../components/SVG";
import { WalletProviderIcon } from "../../components/WalletProviderIcon";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import ModalBase from "../../components/modals/ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { useDelegations } from "../../hooks/useDelegations";
import { useRewards } from "../../hooks/useRewards";
import useSelectedWallet from "../../hooks/useSelectedWallet";
import { UserKind, accountExplorerLink } from "../../networks";
import {
  setSelectedNetworkId,
  setSelectedWalletId,
} from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { neutral33, neutral77 } from "../../utils/style/colors";
import { modalMarginPadding } from "../../utils/style/modals";

interface WalletItemProps {
  item: Wallet;
  zIndex?: number;
  selectable?: boolean;
}

export const WalletItem: React.FC<WalletItemProps> = ({
  item,
  zIndex,
  selectable,
}) => {
  const { width } = useWindowDimensions();
  const { setToastSuccess } = useFeedbacks();
  const [detailsIsVisible, setDetailsIsVisible] = useState(false);
  const selectedWallet = useSelectedWallet();
  const dispatch = useAppDispatch();
  const { totalsRewards, claimAllRewards } = useRewards(
    item.userId,
    UserKind.Single,
  );
  const claimableUSD = totalsRewards.reduce((acc, reward) => {
    return acc + reward.price;
  }, 0);
  const { delegationsBalances } = useDelegations(item.networkId, item.address);
  const delegationsUsdBalance = useMemo(
    () =>
      delegationsBalances.reduce(
        (total, bal) => total + (bal.usdAmount || 0),
        0,
      ),
    [delegationsBalances],
  );

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: neutral33,
        paddingVertical: 16,
        zIndex,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {selectable && (
          <View
            style={{
              alignItems: "center",
              width: 80,
              height: 80,
              justifyContent: "center",
            }}
          >
            {selectedWallet?.id === item.id ? (
              <CheckCircleIcon size={64} color="white" />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  dispatch(setSelectedNetworkId(item.networkId));
                  dispatch(setSelectedWalletId(item.id));
                }}
                style={{
                  borderRadius: 32,
                  width: 52,
                  height: 52,
                  borderColor: "white",
                  borderWidth: 4,
                }}
              />
            )}
          </View>
        )}
        <WalletProviderIcon walletProvider={item.provider} size={64} />
        <View style={{ marginLeft: 16 }}>
          <View>
            <BrandText>{item.provider}</BrandText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <BrandText
                style={{
                  fontSize: 12,
                }}
              >
                {item.address}
              </BrandText>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(item.address);
                  setToastSuccess({
                    title: "Copied",
                    message: "",
                  });
                }}
                style={{
                  height: 24,
                  width: 24,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 4,
                }}
              >
                <SVG width={24} height={24} source={copySVG} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingRight: 32,
            borderRightWidth: 1,
            borderColor: neutral33,
          }}
        >
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
              marginBottom: 2,
              alignSelf: "flex-end",
            }}
          >
            Staked
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            {`$${delegationsUsdBalance.toFixed(2)}`}
          </BrandText>
        </View>
        <View
          style={{
            paddingHorizontal: 32,
          }}
        >
          <BrandText
            style={{
              fontSize: 12,
              color: neutral77,
              marginBottom: 2,
            }}
          >
            Pending rewards
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            {`$${claimableUSD.toFixed(2)}`}
          </BrandText>
        </View>

        {width > 1150 && (
          <SecondaryButton
            size="XS"
            text="Claim rewards"
            disabled={!claimableUSD}
            onPress={claimAllRewards}
            loader
            style={{ marginRight: 16 }}
          />
        )}

        <Menu
          component={<SVG height={32} width={32} source={dotsCircleSVG} />}
          items={[
            ...(width <= 1150
              ? [
                  {
                    label: "Claim rewards",
                    onPress: claimAllRewards,
                    disabled: !claimableUSD,
                  },
                  {
                    label: "Stake",
                    onPress: () => {},
                  },
                ]
              : []),
            {
              label: "View on Explorer",
              onPress: () => {
                Linking.openURL(
                  accountExplorerLink(item.networkId, item.address),
                );
              },
            },
            /*
            {
              label: "Rename address",
              onPress: () => {},
            },
            {
              label: "Delete wallet",
              onPress: () => {},
            },
            */
            { label: "Details", onPress: () => setDetailsIsVisible(true) },
          ]}
        />
      </View>
      <DetailsModal
        wallet={item}
        visible={detailsIsVisible}
        onClose={() => setDetailsIsVisible(false)}
      />
    </View>
  );
};

const DetailsModal: React.FC<{
  wallet: Wallet;
  visible: boolean;
  onClose: () => void;
}> = ({ wallet, visible, onClose }) => {
  return (
    <ModalBase
      label={`${wallet.provider} Wallet Details`}
      visible={visible}
      onClose={onClose}
    >
      <BrandText style={{ marginBottom: modalMarginPadding }}>
        {JSON.stringify(wallet, null, 4)}
      </BrandText>
    </ModalBase>
  );
};
