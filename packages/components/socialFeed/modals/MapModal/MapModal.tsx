import React, {
  Suspense,
  lazy,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Platform, View, ViewStyle } from "react-native";
import { LatLng } from "react-native-leaflet-view";

import {
  neutral17,
  primaryColor,
  transparentColor,
} from "../../../../utils/style/colors";
import { layout } from "../../../../utils/style/layout";
import { PrimaryButton } from "../../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "../../../spacer";

import { ModalWithoutHeader } from "@/components/modals/ModalWithoutHeader";
import { AddressSearch } from "@/components/socialFeed/modals/MapModal/AddressSearch";
import { MapDescriptionInput } from "@/components/socialFeed/modals/MapModal/MapDescriptionInput";
import { MapHeader } from "@/components/socialFeed/modals/MapModal/MapHeader";

const MapView = Platform.select({
  native: () =>
    lazy(() => import("@/components/socialFeed/modals/MapModal/Map.native")),
  web: () =>
    lazy(() => import("@/components/socialFeed/modals/MapModal/Map.web")),
  default: () =>
    lazy(() => import("@/components/socialFeed/modals/MapModal/Map.web")),
})();

interface TMapModalProps {
  visible: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  locationSelected: LatLng;
  setLocationSelected: Dispatch<SetStateAction<LatLng>>;
  description: string;
  setDescription: (newDescription: string) => void;
}

export const MapModal: React.FC<TMapModalProps> = ({
  handleSubmit,
  onClose,
  visible,
  locationSelected,
  setLocationSelected,
  description,
  setDescription,
}) => {
  const [addressPlaceHolder, setAddressPlaceHolder] = useState("Address");
  const [address, setAddress] = useState("");

  return (
    <ModalWithoutHeader
      hideMainSeparator
      hideHeader
      visible={visible}
      onClose={onClose}
      width={457}
    >
      <MapHeader onClose={onClose} />

      <View style={[unitCardStyle]}>
        <AddressSearch
          addressPlaceHolder={addressPlaceHolder}
          setAddressPlaceHolder={setAddressPlaceHolder}
          address={address}
          setAddress={setAddress}
          setLocationSelected={setLocationSelected}
        />

        <SpacerColumn size={2} />

        <View style={[mapContainer]}>
          <Suspense fallback={<></>}>
            <MapView locationSelected={locationSelected} />
          </Suspense>
        </View>

        <SpacerColumn size={2} />

        <MapDescriptionInput
          description={description}
          setDescription={setDescription}
        />

        <SpacerColumn size={2} />

        <View style={[bottomButtom]}>
          <SecondaryButtonOutline
            size="M"
            color={primaryColor}
            borderColor={transparentColor}
            text="Skip location"
            onPress={handleSubmit}
            squaresBackgroundColor={neutral17}
          />
          <SpacerRow size={2} />
          <PrimaryButton
            disabled={addressPlaceHolder === "Address"}
            loader
            size="M"
            text="Add location"
            onPress={handleSubmit}
          />
        </View>
      </View>

      <SpacerColumn size={2} />
    </ModalWithoutHeader>
  );
};

const bottomButtom: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const mapContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  aspectRatio: 6 / 3,
  zIndex: 10,
};

const unitCardStyle: ViewStyle = {
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
  borderRadius: 12,
  justifyContent: "space-between",
};
