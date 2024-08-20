import React, { FC, useState } from "react";
import { View } from "react-native";

import { NewsCarouselSection } from "@/components/carousels/NewsCarouselSection";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";

export const NewsEdition: FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <EditButton
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        saveChanges={() => {
          // TODO
        }}
      />

      {/*TODO: Edition*/}
      <NewsCarouselSection />
    </View>
  );
};
