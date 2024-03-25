import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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

interface TAddressSearchProps {
  addressPlaceHolder: string;
  address: string;
  setAddress: (val: string) => void;
  setLocationSelected: (newLocationSelected: [number, number]) => void;
  setAddressPlaceHolder: (val: string) => void;
}

export const AddressSearch: React.FC<TAddressSearchProps> = ({
  addressPlaceHolder,
  address,
  setAddress,
  setLocationSelected,
  setAddressPlaceHolder,
}) => {
  const [results, setResults] = useState<any>([]);
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
      const data = await response.json();
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
