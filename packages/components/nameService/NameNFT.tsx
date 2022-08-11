import React, { useContext, useEffect, useState } from "react";
import { Image, View, ViewStyle } from "react-native";

import defaultNameNFT from "../../../assets/default-name-nft.png";
import { NSBContext } from "../../context/NSBProvider";
import { getToken } from "../../hooks/tokens";
import { neutral33 } from "../../utils/colors";
import { NameAndTldText } from "./NameAndTldText";
import {FeedbacksContext} from "../../context/FeedbacksProvider"

// A custom TextInput. You can add children (Ex: An icon or a small container)
export const NameNFT: React.FC<{
  style?: ViewStyle;
  name: string;
}> = ({ style, name }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const { setToastError } = useContext(FeedbacksContext);
  const width = 332;
  const height = 404;
  const imageMargin = 12;

  // Find the image !
  useEffect(() => {
    getToken(name)
      .then((tokenData) => {
        if (tokenData && "image" in tokenData && tokenData.image)
          setImageUrl(tokenData.image);
      })
      .catch((strError) => {
        setToastError({
          title: "Something went wrong!",
          message: strError,
        });
      });
  }, [name]);

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: "center",
          borderColor: neutral33,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#000000",
          height,
          minHeight: height,
          maxHeight: height,
          width: "100%",
          maxWidth: width,
        },
        style,
      ]}
    >
      <Image
        source={imageUrl && imageUrl !== "" ? imageUrl : defaultNameNFT}
        style={{
          width: width - imageMargin * 2,
          height: width - imageMargin * 2,
          margin: imageMargin,
        }}
      />

      <NameAndTldText
        nameAndTldStr={name + process.env.TLD}
        style={{ justifyContent: "center" }}
      />
    </View>
  );
};
