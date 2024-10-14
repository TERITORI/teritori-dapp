import React, { useState, Dispatch, SetStateAction } from "react";
import { View } from "react-native";

import { PrimaryButton } from "../../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../buttons/SecondaryButtonOutline";
import { SpacerColumn, SpacerRow } from "../../../spacer";

import { ModalWithoutHeader } from "@/components/modals/ModalWithoutHeader";
import { Map } from "@/components/socialFeed/Map";
import { AddressSearch } from "@/components/socialFeed/modals/MapModal/AddressSearch";
import { MapModalHeader } from "@/components/socialFeed/modals/MapModal/MapModalHeader";
import {
  neutral17,
  primaryColor,
  transparentColor,
} from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { CustomLatLngExpression, PostCategory } from "@/utils/types/feed";

interface TMapModalProps {
  visible: boolean;
  onClose: () => void;
  setLocation: Dispatch<SetStateAction<CustomLatLngExpression | undefined>>;
  // TODO: Description ?
  // description: string;
  // setDescription: (newDescription: string) => void;
  location?: CustomLatLngExpression;
  postCategory?: PostCategory;
}

export const MapModal: React.FC<TMapModalProps> = ({
  onClose,
  visible,
  setLocation,
  location,
  postCategory,
}) => {
  const [addressPlaceHolder, setAddressPlaceHolder] = useState("Address");
  const [address, setAddress] = useState("");
  const [creatingPostLocation, setCreatingPostLocation] = useState<
    CustomLatLngExpression | undefined
  >(location);

  return (
    <ModalWithoutHeader
      hideMainSeparator
      hideHeader
      visible={visible}
      onClose={onClose}
      boxStyle={{
        width: "100%",
        height: "100%",
        maxWidth: 700,
        maxHeight: 800,
      }}
      childrenContainerStyle={{
        height: "100%",
      }}
    >
      <MapModalHeader onClose={onClose} />

      <View
        style={{
          width: "100%",
          flex: 1,
          backgroundColor: neutral17,
          padding: layout.spacing_x1_5,
          borderRadius: 12,
          justifyContent: "space-between",
        }}
      >
        <AddressSearch
          addressPlaceHolder={addressPlaceHolder}
          setAddressPlaceHolder={setAddressPlaceHolder}
          address={address}
          setAddress={setAddress}
          setLocationSelected={setCreatingPostLocation}
        />

        <SpacerColumn size={2} />

        <View
          style={{
            flex: 1,
            height: "100%",
          }}
        >
          <Map
            creatingPostLocation={creatingPostLocation}
            creatingPostCategory={postCategory}
          />
        </View>

        {/*TODO: Description ?*/}
        {/*<SpacerColumn size={2} />*/}
        {/*<MapDescriptionInput*/}
        {/*  description={description}*/}
        {/*  setDescription={setDescription}*/}
        {/*/>*/}

        <SpacerColumn size={2} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {location && (
            <>
              <SecondaryButtonOutline
                size="M"
                color={primaryColor}
                borderColor={transparentColor}
                text="Remove Location"
                onPress={() => {
                  setCreatingPostLocation(undefined);
                  setLocation(undefined);
                  onClose();
                }}
                squaresBackgroundColor={neutral17}
              />
              <SpacerRow size={2} />
            </>
          )}

          <PrimaryButton
            disabled={addressPlaceHolder === "Address"}
            loader
            size="M"
            text={location ? "Update Location" : "Add Location"}
            onPress={() => {
              setLocation(creatingPostLocation);
              onClose();
            }}
          />
        </View>
      </View>
      <SpacerColumn size={2} />
    </ModalWithoutHeader>
  );
};
