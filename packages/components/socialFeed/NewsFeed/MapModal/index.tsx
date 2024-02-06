import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import chevronLeft from "../../../../../assets/icons/chevron-left.svg";
import close from "../../../../../assets/icons/close.svg";
import location from "../../../../../assets/icons/location.svg";
import {
  neutral17,
  neutral77,
  neutralA3,
  primaryColor,
  secondaryColor,
  transparentColor,
} from "../../../../utils/style/colors";
import {
  fontMedium16,
  fontSemibold13,
  fontSemibold16,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { PrimaryButton } from "../../../buttons/PrimaryButton";
import { SecondaryButtonOutline } from "../../../buttons/SecondaryButtonOutline";
import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../../inputs/TextInputOutsideLabel";
import ModalBase from "../../../modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../spacer";

const MapComponent = Platform.select({
  native: () => lazy(() => import("./Map")),
  default: () => lazy(() => import("./Map.web")),
})();

let typingTimeout: NodeJS.Timeout | undefined;

interface TMapModalProps {
  visible: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
}

type Tlocation = [number, number];

export const MapModal: React.FC<TMapModalProps> = ({
  handleSubmit,
  onClose,
  visible,
}) => {
  const [description, setDescription] = useState("");
  const [addressPlaceHolder, setAddressPlaceHolder] = useState("Address");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>([]);
  const [locationSelected, setLocationSelected] = useState<Tlocation>([
    48.8566, 2.3522,
  ]);

  const searchAddress = async (params: string) => {
    return new Promise((resolve, reject) => {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${params}&format=json`,
      )
        .then((response) => response.json()) // Parse the JSON response
        .then((data) => resolve(data)) // Resolve the promise with the location data
        .catch((error) => reject(error)); // Reject the promise with the error
    });
  };

  useEffect(() => {
    if (address.trim() === "") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    clearTimeout(typingTimeout);
    setResults([]);
    typingTimeout = setTimeout(() => {
      searchAddress(address)
        .then((searchResults) => {
          setResults(searchResults);
          setIsLoading(false);
        })
        .catch(() => {
          setResults([]);
          setIsLoading(false);
        });
    }, 1500);
    return () => clearTimeout(typingTimeout);
  }, [address]);

  return (
    <ModalBase
      hideMainSeparator
      hideHeader
      visible={visible}
      onClose={onClose}
      width={457}
    >
      <View style={[header]}>
        <View style={[headerText]}>
          <View style={[button32]}>
            <SVG
              source={chevronLeft}
              height={24}
              width={24}
              color={secondaryColor}
            />
          </View>
          <BrandText style={[fontSemibold16]}>Add location</BrandText>
          <SpacerRow size={2} />
          <BrandText style={[fontMedium16, { color: neutralA3 }]}>
            2/2
          </BrandText>
        </View>

        <TouchableOpacity style={[button32]} onPress={onClose}>
          <SVG source={close} height={24} width={24} color={secondaryColor} />
        </TouchableOpacity>
      </View>

      <View style={[unitCardStyle]}>
        <TextInputOutsideLabel
          label="Enter an adress to afiliate your content with"
          isAsterickSign
        />
        <View style={{ position: "relative", zIndex: 20 }}>
          <TextInputCustom
            noBrokenCorners
            label=""
            hideLabel
            name="address"
            placeHolder={addressPlaceHolder}
            onChangeText={setAddress}
            value={address}
          />
          <View
            style={[
              locationContainer,
              { paddingVertical: results.length || isLoading ? 20 : 0 },
            ]}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={secondaryColor} />
            ) : (
              <ScrollView showsVerticalScrollIndicator>
                {results.map((item: any, index: number) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={[locationItem]}
                    onPress={() => {
                      setLocationSelected([item.lat, item.lon]);
                      setAddressPlaceHolder(item.display_name);
                      setAddress("");
                      setResults([]);
                    }}
                  >
                    <View style={[button24]}>
                      <SVG
                        source={location}
                        height={24}
                        width={24}
                        color={primaryColor}
                      />
                    </View>
                    <BrandText style={[fontSemibold13]}>
                      {item.display_name}
                    </BrandText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <SpacerColumn size={2} />

        <View style={[mapContainer]}>
          <Suspense fallback={<></>}>
            <MapComponent locationSelected={locationSelected} />
          </Suspense>
        </View>

        <SpacerColumn size={2} />
        <TextInputOutsideLabel label="Describe for people that will find this track on map" />
        <TextInputCustom
          noBrokenCorners
          label=""
          hideLabel
          name="description"
          placeHolder="Description"
          multiline
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
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
              // handleSubmit(processSubmit)();
            }}
          />
        </View>
      </View>
      <SpacerColumn size={2} />
    </ModalBase>
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

const locationItem: ViewStyle = {
  flexDirection: "row",
  borderBottomColor: neutral77,
  borderBottomWidth: 0.5,
  paddingVertical: 5,
};

const locationContainer: ViewStyle = {
  flexDirection: "column",
  position: "absolute",
  top: 50,
  left: 0,
  width: "100%",
  maxHeight: 200,
  backgroundColor: "rgba(0,0,0,0.8)",
};

const headerText: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
};

const button32: ViewStyle = {
  height: 32,
  width: 32,
  alignItems: "center",
  justifyContent: "center",
};

const button24: ViewStyle = {
  height: 24,
  width: 24,
  alignItems: "center",
  justifyContent: "center",
};

const header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  paddingVertical: 20,
};

const unitCardStyle: ViewStyle = {
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
  borderRadius: 12,
  justifyContent: "space-between",
};
