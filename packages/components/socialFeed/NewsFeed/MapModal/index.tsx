import "./styles.css";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { RawResult } from "leaflet-geosearch/dist/providers/openStreetMapProvider";
import { SearchResult } from "leaflet-geosearch/dist/providers/provider";
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import {
  ActivityIndicator,
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
  // fontSemibold13,
  fontSemibold16,
  // fontSemibold20,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { PrimaryButton } from "../../../buttons/PrimaryButton";
// import { SecondaryButton } from "../../buttons/SecondaryButton";
import { SecondaryButtonOutline } from "../../../buttons/SecondaryButtonOutline";
// import { TextInputCustomBorder } from "../../inputs/TextInputCustomBorder";
import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../../inputs/TextInputOutsideLabel";
import ModalBase from "../../../modals/ModalBase";
import { SpacerColumn, SpacerRow } from "../../../spacer";

let typingTimeout: NodeJS.Timeout | undefined;

interface TMapModalProps {
  visible: boolean;
  onClose: () => void;
  handleSubmit?: () => void;
}

type Tlocation = [number, number];

export const TRACK_CARD_WIDTH = 242;
// const [searchRequest, SetSearchRequest] = useState(false);
// const [txt, setTxt] = useState("lome");

export const MapModal: React.FC<TMapModalProps> = ({
  handleSubmit,
  onClose,
  visible,
}) => {
  const [description, setDescription] = useState("");
  const [addressPlaceHolder, setAddressPlaceHolder] = useState("Address");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult<RawResult>[]>([]);
  const [locationSelected, setLocationSelected] = useState<Tlocation>([
    48.8566, 2.3522,
  ]);

  const customIcon = new Icon({
    iconUrl: require("./location.png"),
    iconSize: [38, 38], // size of the icon
  });

  const searchAddress = async (params: string) => {
    const provider = new OpenStreetMapProvider();
    return await provider.search({ query: params });
  };

  useEffect(() => {
    if (address.trim() === "") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    clearTimeout(typingTimeout);
    setResults([]);
    typingTimeout = setTimeout(async () => {
      const searchResults: SearchResult<RawResult>[] =
        await searchAddress(address);
      setResults(searchResults);
      setIsLoading(false);
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: 32,
              width: 32,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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

        <TouchableOpacity
          style={{
            height: 32,
            width: 32,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={onClose}
        >
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
            name="address"
            placeHolder={addressPlaceHolder}
            onChangeText={setAddress}
            value={address}
          />
          <View
            style={{
              flexDirection: "column",
              position: "absolute",
              top: 50,
              left: 0,
              width: "100%",
              maxHeight: 200,
              backgroundColor: "rgba(0,0,0,0.8)",
              paddingVertical: results.length || isLoading ? 20 : 0,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={secondaryColor} />
            ) : (
              <ScrollView showsVerticalScrollIndicator>
                {results.map((item, index) => (
                  <TouchableOpacity
                    key={index.toString()}
                    style={{
                      flexDirection: "row",
                      borderBottomColor: neutral77,
                      borderBottomWidth: 0.5,
                      paddingVertical: 5,
                    }}
                    onPress={() => {
                      console.log("item", item);
                      setLocationSelected([item.y, item.x]);
                      setAddressPlaceHolder(item.label);
                      setAddress("");
                      setResults([]);
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        height: 24,
                        width: 24,
                      }}
                    >
                      <SVG
                        source={location}
                        height={24}
                        width={24}
                        color={primaryColor}
                      />
                    </View>
                    <BrandText style={[fontSemibold13]}>{item.label}</BrandText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
        <SpacerColumn size={2} />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            aspectRatio: 6 / 3,
            // backgroundColor: currencyATOMcolor,
            zIndex: 10,
          }}
        >
          {/* Mapping through the markers */}
          <MapContainer
            key={locationSelected.toString()}
            center={locationSelected}
            zoom={8}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=QkwJFLzzxPan25YCgnDExGpMFPxA3x4lnyKiUf8zmaqXLP5XyOR8n3yEM8jlKV3W" />
            <Marker position={locationSelected} icon={customIcon} />
          </MapContainer>
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

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SecondaryButtonOutline
            size="M"
            color={primaryColor}
            borderColor={transparentColor}
            text="Skip location"
            onPress={handleSubmit}
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

const unitCardStyle: ViewStyle = {
  // width: TRACK_CARD_WIDTH,
  backgroundColor: neutral17,
  padding: layout.spacing_x1_5,
  borderRadius: 12,
  justifyContent: "space-between",
};
