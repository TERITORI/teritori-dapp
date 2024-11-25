import { bech32 } from "bech32";
import { useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import addSVG from "@/assets/icons/add-circle-outline.svg";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

import { CustomButton } from "@/components/buttons/CustomButton";
import { SpacerColumn } from "@/components/spacer";
import { useFeedbacks } from "@/context/FeedbacksProvider";
import {
  addEntry,
  removeEntry,
  selectAddressBookById,
} from "@/store/slices/wallets";
import { RootState, useAppDispatch } from "@/store/store";
import { ScreenFC } from "@/utils/navigation";
import { layout } from "@/utils/style/layout";

const EditAddressBookScreen: ScreenFC<"EditAddressBook"> = ({
  navigation,
  route,
}) => {
  const { setToast } = useFeedbacks();
  const goBackTo = () =>
    navigation.replace("AddressBook", { back: "EditAddressBook" });

  const { addressId } = route.params;
  let bookEntry = useSelector((state: RootState) =>
    selectAddressBookById(state, addressId),
  );
  if (!bookEntry) {
    // this has a race condition with the navigation
    bookEntry = {
      id: 0,
      name: "",
      address: "",
      networkId: "",
    };
  }
  // add local state for name and address
  const [name, setName] = useState(bookEntry.name);
  const [address, setAddress] = useState(bookEntry.address);

  const dispatch = useAppDispatch();

  return (
    <BlurScreenContainer title="Edit Address" onGoBack={goBackTo}>
      <SpacerColumn size={2} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: layout.spacing_x2,
        }}
      >
        <CircularImgOrIcon
          style={{ alignItems: "center", justifyContent: "center" }}
          icon={addSVG}
        />
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
            value={name}
            onChangeText={setName}
          />

          <SpacerColumn size={1} />
          <MiniTextInput
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <CustomButton
          onPress={() => {
            if (bookEntry) {
              // this has a race condition with the navigation
              dispatch(removeEntry(bookEntry.id));
            }
            navigation.navigate("AddressBook", { back: "AddAddressBook" });
          }}
          type="danger"
          title="Delete"
          style={{ marginBottom: layout.spacing_x2 }}
        />

        <CustomButton
          onPress={() => {
            if (name !== "" && address !== "") {
              if (bookEntry) {
                try {
                  bech32.decode(address);
                  dispatch(
                    addEntry({
                      id: bookEntry.id,
                      name,
                      address,
                      networkId: "teritori", // hardcoded for now
                    }),
                  );
                  navigation.navigate("AddressBook", {
                    back: "AddAddressBook",
                  });
                } catch (e) {
                  setToast({
                    message: `Invalid address ${e} ${address}`,
                    duration: 5000,
                    mode: "mini",
                    type: "error",
                  });
                }
              }
            }
            navigation.navigate("AddressBook", { back: "AddAddressBook" });
          }}
          title="Save"
        />
      </View>
    </BlurScreenContainer>
  );
};

export default EditAddressBookScreen;
