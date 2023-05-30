import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Linking,
} from "react-native";

import copySVG from "../../../assets/icons/copy.svg";
import dotsCircleSVG from "../../../assets/icons/dots-circle.svg";
import { BrandText } from "../../components/BrandText";
import { Menu } from "../../components/Menu";
import { NetworkIcon } from "../../components/NetworkIcon";
import { SVG } from "../../components/SVG";
import { SecondaryButton } from "../../components/buttons/SecondaryButton";
import { useFeedbacks } from "../../context/FeedbacksProvider";
import { Wallet } from "../../context/WalletsProvider";
import { rewardsPrice, useRewards } from "../../hooks/useRewards";
import { accountExplorerLink, getNetwork } from "../../networks";
import { setSelectedWallet } from "../../store/slices/settings";
import { useAppDispatch } from "../../store/store";
import { neutral33, neutral77 } from "../../utils/style/colors";

export interface WalletItemProps {
  index: number;
  itemsCount: number;
  wallet: Wallet;
}

export const WalletItem: React.FC<WalletItemProps> = ({
  index,
  wallet,
  itemsCount,
}) => {
  const { width } = useWindowDimensions();
  const { setToastSuccess } = useFeedbacks();
  const { claimAllRewards, totalsRewards } = useRewards(wallet.userId);
  const dispatch = useAppDispatch();

  const claimablePrice = rewardsPrice(totalsRewards);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: index !== itemsCount - 1 ? 1 : 0,
        borderColor: neutral33,
        paddingVertical: 16,
        zIndex: 10 + itemsCount - index,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <NetworkIcon networkId={wallet.networkId} size={64} />
        <View style={{ marginLeft: 16 }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  setSelectedWallet(
                    wallet && {
                      walletId: wallet.id,
                      networkId: wallet.networkId,
                    }
                  )
                );
              }}
            >
              <BrandText>
                {getNetwork(wallet.networkId)?.displayName || "Unknown"}
              </BrandText>
            </TouchableOpacity>
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
                {wallet.address}
              </BrandText>
              <TouchableOpacity
                onPress={() => {
                  Clipboard.setString(wallet.address);
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
            }}
          >
            Staked
          </BrandText>
          <BrandText
            style={{
              fontSize: 14,
            }}
          >
            {/*String(item.staked).split(".")[0]*/}
            Coming Soon
            {/*<BrandText
              style={{
                color: neutralA3,
                fontSize: 14,
              }}
            >
              .{String(item.staked).split(".")[1]}
            </BrandText>*/}
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
            {`$${claimablePrice.toFixed(2)}`}
          </BrandText>
        </View>

        {width > 1150 && (
          <SecondaryButton
            size="XS"
            text="Claim rewards"
            disabled={!claimablePrice}
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
                    disabled: !claimablePrice,
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
                console.log("item", wallet);
                Linking.openURL(
                  accountExplorerLink(wallet.networkId, wallet.address)
                );
              },
            },
            {
              label: "Rename address",
              onPress: () => {},
            },
            {
              label: "Delete wallet",
              onPress: () => {},
            },
          ]}
        />
      </View>
    </View>
  );
};
