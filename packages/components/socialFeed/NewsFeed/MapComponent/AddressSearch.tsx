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

let typingTimeout: NodeJS.Timeout | undefined;

interface TAddressSearchProps {
  addressPlaceHolder: any;
  address: any;
  setAddress: any;
  setLocationSelected: any;
  setAddressPlaceHolder: any;
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
