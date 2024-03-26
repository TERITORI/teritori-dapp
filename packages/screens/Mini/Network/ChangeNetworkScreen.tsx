import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { FlatList, View } from "react-native";

import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import Checkbox from "../components/Checkbox/Checkbox";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { Separator } from "@/components/separators/Separator";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useSelectedNativeWallet } from "@/hooks/wallet/useSelectedNativeWallet";
import { CosmosNetworkInfo, getCosmosNetwork } from "@/networks";
import { updateWallet } from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
import { RootStackParamList } from "@/utils/navigation";
import { neutralA3 } from "@/utils/style/colors";
import { fontNormal15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type ChangeNetworkScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ChangeNetwork">;
};

export default function ChangeNetworkScreen({
  navigation,
}: ChangeNetworkScreenProps) {
  const goBackTo = () => navigation.replace("MiniSettings");
  const selectedWallet = useSelectedNativeWallet();

  const addresses: CosmosNetworkInfo[] = [
    getCosmosNetwork("teritori")!,
    getCosmosNetwork("teritori-testnet")!,
  ];
  const { setToast } = useFeedbacks();
  const dispatch = useAppDispatch();

  return (
    <BlurScreenContainer
      title="Change Network"
      onGoBack={goBackTo}
      noScrollView
    >
      {!addresses.length ? (
        <BrandText
          style={[
            fontNormal15,
            {
              color: neutralA3,
              paddingTop: layout.spacing_x2,
              paddingHorizontal: layout.spacing_x1_5,
            },
          ]}
        >
          No Network to Display
        </BrandText>
      ) : (
        <FlatList
          inverted
          data={addresses.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListView
              style={{
                paddingHorizontal: layout.spacing_x1_5,
              }}
              options={{
                label: item?.displayName,
                iconEnabled: false,
                rightLabel: (
                  <View>
                    <Checkbox
                      isChecked={selectedWallet?.networkId === item?.id}
                      value={item?.displayName}
                      onPress={() => {
                        goBackTo();
                        if (!selectedWallet) {
                          setToast({
                            mode: "mini",
                            type: "error",
                            message: "No wallet selected",
                          });
                          return;
                        }
                        dispatch(
                          updateWallet({
                            ...selectedWallet,
                            networkId: item?.id,
                          }),
                        );
                        setToast({
                          mode: "mini",
                          type: "success",
                          message: `Now using ${item?.displayName} network`,
                        });
                      }}
                      checkboxStyle={{
                        borderRadius: 12,
                        width: 24,
                        height: 24,
                      }}
                    />
                  </View>
                ),
                bottomLabel: item?.rpcEndpoint,
              }}
            />
          )}
        />
      )}
      <SpacerColumn size={1.5} />
      <Separator />
      <ListView
        style={{
          paddingVertical: layout.spacing_x4,
          paddingHorizontal: layout.spacing_x1_5,
        }}
        options={{
          label: "Add Network",
          leftIconEnabled: true,
          leftIconOptions: {
            icon: AddNewSvg,
            fill: "#fff",
          },
        }}
      />
    </BlurScreenContainer>
  );
}
