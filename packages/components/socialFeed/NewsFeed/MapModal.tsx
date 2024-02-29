import React, { Suspense, lazy, useState } from "react";
import { Platform, View, ViewStyle } from "react-native";

import { AddressSearch } from "./MapComponent/AddressSearch";
import { MapDescriptionInput } from "./MapComponent/MapDescriptionInput";
import { MapHeader } from "./MapComponent/MapHeader";
import {
  neutral17,
  primaryColor,
  transparentColor,
} from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { PrimaryButton } from "../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "../../spacer";

import { ModalWithoutHeader } from "@/components/modals/ModalWithoutHeader";

const MapView = Platform.select({
  native: () => lazy(() => import("./MapComponent/Map.native")),
  default: () => lazy(() => import("./MapComponent/Map.web")),
})();

interface TMapModalProps {
  visible: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
  locationSelected: [number, number];
  setLocationSelected: (newLocationSelected: [number, number]) => void;
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
            onPress={() => {
              console.log("wait for instructions...🙂");
              console.log({ locationSelected, description });
            }}
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
