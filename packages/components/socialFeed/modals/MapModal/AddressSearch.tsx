import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { LatLng } from "react-native-leaflet-view";
import { z } from "zod";

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

import location from "@/assets/icons/location.svg";
import { useDebounce } from "@/hooks/useDebounce";

const zodAddressSearchResult = z.array(
  z.object({
    lat: z.string(),
    lon: z.string(),
    display_name: z.string(),
  }),
);

interface AddressSearchProps {
  addressPlaceHolder: string;
  address: string;
  setAddress: Dispatch<SetStateAction<string>>;
  setLocationSelected: Dispatch<SetStateAction<LatLng>>;
  setAddressPlaceHolder: Dispatch<SetStateAction<string>>;
}

export const AddressSearch: React.FC<AddressSearchProps> = ({
  addressPlaceHolder,
  address,
  setAddress,
  setLocationSelected,
  setAddressPlaceHolder,
}) => {
  const debouncedAddress = useDebounce(address, 1500);

  const { data, isLoading } = useQuery(
    ["searchAddress", debouncedAddress],
    async () => {
      if (debouncedAddress.trim() === "") {
        return [];
      }
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${debouncedAddress}&format=json`,
      );
      if (!response.ok) {
        throw new Error("Invalid HTTP status: " + response.status);
      }
      const data = zodAddressSearchResult.parse(await response.json());
      return data;
    },
  );

  const results = useMemo(() => {
    if (!data) {
      return [];
    }
    return data;
  }, [data]);

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
                  key={index}
                  style={[locationItem]}
                  onPress={() => {
                    setLocationSelected([
                      parseFloat(item.lat),
                      parseFloat(item.lon),
                    ]);
                    setAddressPlaceHolder(item.display_name);
                    setAddress("");
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
