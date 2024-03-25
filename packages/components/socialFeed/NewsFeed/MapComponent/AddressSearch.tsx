import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LatLng } from "react-native-leaflet-view";

import location from "../../../../../assets/icons/location.svg";
import {
  neutral77,
  primaryColor,
  secondaryColor,
} from "../../../../utils/style/colors";
import { fontSemibold13 } from "../../../../utils/style/fonts";
import { BrandText } from "../../../BrandText";
import { SVG } from "../../../SVG";
import { TextInputCustom } from "../../../inputs/TextInputCustom";
import { TextInputOutsideLabel } from "../../../inputs/TextInputOutsideLabel";

import { useDebounce } from "@/hooks/useDebounce";

interface NominatimSearchResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface TAddressSearchProps {
  addressPlaceHolder: string;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  setLocationSelected: Dispatch<SetStateAction<LatLng>>;
  setAddressPlaceHolder: Dispatch<SetStateAction<string>>;
}

export const AddressSearch: React.FC<TAddressSearchProps> = ({
  addressPlaceHolder,
  address,
  setAddress,
  setLocationSelected,
  setAddressPlaceHolder,
}) => {
  const [results, setResults] = useState<NominatimSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedAddress = useDebounce(address, 1500);

  const { data: searchAddressValue, error } = useQuery(
    ["searchAddress", debouncedAddress],
    async () => {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${debouncedAddress}&format=json`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: NominatimSearchResult[] = await response.json();
      setIsLoading(false);
      return data;
    },
    {
      enabled: debouncedAddress.trim() !== "",
    },
  );

  useEffect(() => {
    setResults([]);
    if (error) {
      setResults([]);
      setIsLoading(false);
    }
    if (!searchAddressValue || searchAddressValue.length === 0) {
      setResults([]);
    } else {
      setResults(searchAddressValue);
    }
  }, [searchAddressValue, error]);

  return (
    <>
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
          onChangeText={(val: string) => {
            setIsLoading(true);
            setAddress(val);
          }}
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
              {results.map((item, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  style={[locationItem]}
                  onPress={() => {
                    setLocationSelected([
                      parseFloat(item.lat),
                      parseFloat(item.lon),
                    ]);
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
    </>
  );
};

// AddressSearch
const locationContainer: ViewStyle = {
  flexDirection: "column",
  position: "absolute",
  top: 50,
  left: 0,
  width: "100%",
  maxHeight: 200,
  backgroundColor: "rgba(0,0,0,0.8)",
};

const locationItem: ViewStyle = {
  flexDirection: "row",
  borderBottomColor: neutral77,
  borderBottomWidth: 0.5,
  paddingVertical: 5,
};

const button24: ViewStyle = {
  height: 24,
  width: 24,
  alignItems: "center",
  justifyContent: "center",
};
