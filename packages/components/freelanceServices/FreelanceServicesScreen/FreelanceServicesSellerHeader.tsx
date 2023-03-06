import React from "react";
import { View } from "react-native";
import { BrandText } from "../../BrandText";
import { Separator } from "../../Separator";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import {useAppNavigation} from "../../../utils/navigation";

export const FreelanceServicesSellerHeader: React.FC = () => {
  // const { width } = useWindowDimensions();
  const navigation = useAppNavigation();

  return (
    <View style={{alignItems: "center"}}>
      <BrandText style={{ fontSize: 28, alignSelf: "center", marginTop: 50 }}>
        Progress through your Efforts
      </BrandText>
      <SecondaryButton style={{marginTop: 20}} size = "SM" text="Become a Seller" onPress={()=>{navigation.navigate("FreelanceServicesProfileSeller");}}></SecondaryButton>
      <Separator style={{ width: 360, alignSelf: "center", marginTop: 50 }} />
    </View>
  );
};
