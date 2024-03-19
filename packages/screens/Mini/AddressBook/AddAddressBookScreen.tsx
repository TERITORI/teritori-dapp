import { bech32 } from "bech32";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import addSVG from "../../../../assets/icons/add-circle-outline.svg";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { BrandText } from "@/components/BrandText";
import { UserAvatarWithFrame } from "@/components/images/AvatarWithFrame";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import { useNSUserInfo } from "@/hooks/useNSUserInfo";
import { addEntry, selectAllAddressBook } from "@/store/slices/wallets";
import { useAppDispatch } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { neutral77 } from "@/utils/style/colors";
import { fontMedium15 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

const AddAddressBookScreen: ScreenFC<"AddAddressBook"> = ({ navigation }) => {
  const { setToast } = useFeedbacks();
  const goBackTo = () =>
    navigation.replace("AddressBook", { back: "AddAddressBook" });
  const dispatch = useAppDispatch();

  const [name, setName] = useState("aa");
  const [address, setAddress] = useState("");
  const addresses = useSelector(selectAllAddressBook);
  // hoping to reduce duplicate ids
  const newId = useMemo(() => addresses.length + 1, [addresses]);

  const {
    metadata: { image, tokenId },
  } = useNSUserInfo(`tori-${address}`);

  useEffect(() => {
    setName(tokenId || "");
  }, [tokenId, address]);
  return (
    <BlurScreenContainer title="Add Address" onGoBack={goBackTo}>
      <SpacerColumn size={2} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        {image ? (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <UserAvatarWithFrame userId={`tori-${address}`} size="XL" />
            <BrandText style={[fontMedium15, { color: neutral77 }]}>
              {tokenId}
            </BrandText>
          </View>
        ) : (
          <CircularImgOrIcon
            style={{ alignItems: "center", justifyContent: "center" }}
            icon={addSVG}
          />
        )}
      </View>
      <SpacerColumn size={4} />
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: layout.spacing_x2,
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          <MiniTextInput
            placeholder="Label"
            onChangeText={setName}
            value={name}
          />

          <SpacerColumn size={1} />
          <MiniTextInput placeholder="Address" onChangeText={setAddress} />
        </View>

        <CustomButton
          onPress={() => {
            if (name !== "" && address !== "") {
              try {
                bech32.decode(address);
                dispatch(
                  addEntry({
                    id: newId,
                    name,
                    address,
                    networkId: "teritori", // hardcoded for now
                  }),
                );
                navigation.navigate("AddressBook", { back: "AddAddressBook" });
              } catch (e) {
                setToast({
                  message: `Invalid address ${e} ${address}`,
                  duration: 5000,
                  mode: "mini",
                  type: "error",
                });
              }
            } else {
              setToast({
                message: `Please fill in all fields`,
                duration: 3000,
                mode: "mini",
                type: "error",
              });
            }
          }}
          title="Add"
        />
      </View>
    </BlurScreenContainer>
  );
};

export default AddAddressBookScreen;
