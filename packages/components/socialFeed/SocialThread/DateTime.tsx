import moment from "moment";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

import { fontSemibold12 } from "../../../utils/style/fonts";
import { BrandText } from "../../BrandText";

interface Props {
  date: string;
}
export const DateTime = ({ date }: Props) => {
  const [isFullDate, setIsFullDate] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setIsFullDate((prev) => !prev)}
    >
      <BrandText style={fontSemibold12}>
        {isFullDate
          ? moment(date).local().format("MMM D, YYYY [at] hh:mm a")
          : moment(date).local().fromNow()}
      </BrandText>
    </TouchableOpacity>
  );
};
