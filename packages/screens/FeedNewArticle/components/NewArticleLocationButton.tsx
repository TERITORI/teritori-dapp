import React, { Dispatch, FC, SetStateAction, useState } from "react";

import { LocationButton } from "@/components/socialFeed/NewsFeed/LocationButton";
import { neutral33, neutralFF } from "@/utils/style/colors";
import { CustomLatLngExpression } from "@/utils/types/feed";

export const NewArticleLocationButton: FC<{
  location?: CustomLatLngExpression;
  setIsMapShown: Dispatch<SetStateAction<boolean>>;
}> = ({ location, setIsMapShown }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <>
      <LocationButton
        onPress={() => setIsMapShown(true)}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
        stroke={!location ? neutralFF : undefined}
        color={!location ? undefined : neutralFF}
        style={{
          height: 48,
          width: 48,
          borderWidth: 1,
          borderColor: isHovered ? neutralFF : neutral33,
          borderRadius: 6,
          alignItems: "center",
          justifyContent: "center",
        }}
      />
    </>
  );
};
