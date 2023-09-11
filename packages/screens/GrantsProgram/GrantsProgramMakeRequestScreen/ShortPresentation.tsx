import React from "react";
import { View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { neutral77 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";

export const ShortPresentation: React.FC = () => {
  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <BrandText style={fontSemibold20}>Grant details</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Grant
      </BrandText>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Name *"
        name="name"
        fullWidth
        placeholder="Your Grant name"
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Description *"
        name="description"
        fullWidth
        multiline
        placeholder="Your Grant description"
        textInputStyle={{ height: 80 }}
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Budget *"
        name="budget"
        fullWidth
        placeholder="What budget do you need?"
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Payment Address (Gnoland or Cosmos) *"
        name="paymentAddr"
        fullWidth
        placeholder="Type Gnoland or Cosmos payment address..."
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Cover image *"
        name="coverImg"
        fullWidth
        placeholder="Type Gnoland or Cosmos payment address..."
        variant="labelOutside"
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Tags *"
        name="tags"
        fullWidth
        placeholder="Add  1-5 main Grant tags using comma..."
        variant="labelOutside"
      />
    </View>
  );
};
