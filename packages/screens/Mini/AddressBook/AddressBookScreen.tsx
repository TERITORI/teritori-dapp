import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import AddNewSvg from "../../../../assets/icons/add-circle-filled.svg";
import { BrandText } from "../../../components/BrandText";
import { Separator } from "../../../components/separators/Separator";
import { SpacerColumn } from "../../../components/spacer";
import { selectAllAddressBook } from "../../../store/slices/wallets";
import { ScreenFC } from "../../../utils/navigation";
import { neutralA3 } from "../../../utils/style/colors";
import { fontNormal15 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import ListView from "../components/ListView";
import { BlurScreenContainer } from "../layout/BlurScreenContainer";

const AddressBookScreen: ScreenFC<"AddressBook"> = ({ navigation }) => {
  const goBackTo = () => navigation.replace("MiniSettings");

  const addresses = useSelector(selectAllAddressBook);

  return (
    <BlurScreenContainer title="Address Book" onGoBack={goBackTo}>
      <View style={{ paddingHorizontal: layout.spacing_x2, flex: 1 }}>
        {!addresses.length ? (
          <BrandText
            style={[
              fontNormal15,
              {
                color: neutralA3,
                paddingTop: layout.spacing_x2,
              },
            ]}
          >
            No Address to Display
          </BrandText>
        ) : (
          <FlatList
            inverted
            data={addresses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ListView
                onPress={() =>
                  navigation.replace("EditAddressBook", {
                    addressId: item.id.toString(),
                    back: "AddressBook",
                  })
                }
                options={{
                  label: item?.name,
                  iconEnabled: false,
                  rightLabel: item?.address,
                }}
              />
            )}
          />
        )}
        <SpacerColumn size={1.5} />
        <Separator />
        <ListView
          onPress={() =>
            navigation.replace("AddAddressBook", { back: "AddressBook" })
          }
          style={{
            paddingVertical: layout.spacing_x4,
          }}
          options={{
            label: "Add Address",
            leftIconEnabled: true,
            iconEnabled: true,
            leftIconOptions: {
              icon: AddNewSvg,
              fill: "#fff",
            },
          }}
        />
      </View>
    </BlurScreenContainer>
  );
};

export default AddressBookScreen;
