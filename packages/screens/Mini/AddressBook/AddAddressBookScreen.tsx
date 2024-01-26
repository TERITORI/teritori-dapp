import { bech32 } from "bech32";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";

import addSVG from "../../../../assets/icons/add-circle-outline.svg";
import { SpacerColumn } from "../../../components/spacer";
import { addEntry, selectAllAddressBook } from "../../../store/slices/wallets";
import { useAppDispatch } from "../../../store/store";
import { ScreenFC } from "../../../utils/navigation";
import { layout } from "../../../utils/style/layout";
import { CustomButton } from "../components/Button/CustomButton";
import CircularImgOrIcon from "../components/CircularImgOrIcon";
import MiniTextInput from "../components/MiniTextInput";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

const AddAddressBookScreen: ScreenFC<"AddAddressBook"> = ({ navigation }) => {
  const goBackTo = () =>
    navigation.replace("AddressBook", { back: "AddAddressBook" });
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const addresses = useSelector(selectAllAddressBook);
  // hoping to reduce duplicate ids
  const newId = useMemo(() => addresses.length + 1, [addresses]);

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
          <MiniTextInput placeholder="Label" onChangeText={setName} />

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
                alert(`Invalid address ${e} ${address}`); // TODO: make a better UI FIXME
              }
            } else {
              console.log("Please fill in all fields");
            }
          }}
          title="Add"
        />
      </View>
    </BlurScreenContainer>
  );
};

export default AddAddressBookScreen;
