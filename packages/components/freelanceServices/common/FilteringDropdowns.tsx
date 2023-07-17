import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";

import chevronUp from "../../../../assets/icons/chevron-up.svg";
import chevronDown from "../../../../assets/icons/freelance-service/chevron-down.svg";
import sort from "../../../../assets/icons/sort.svg";
import { getFilterOptions } from "../../../screens/FreelanceServices/query/data";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { TertiaryBox } from "../../boxes/TertiaryBox";
import { BudgetDropDownMenu } from "../LogoDesign/DropDownMenu/BudgetDropDownMenu";
import { DeliveryTimeDropDownMenu } from "../LogoDesign/DropDownMenu/DeliveryTimeDropDownMenu";
import { DropdownFilterWithCheckbox } from "../LogoDesign/DropDownMenu/DropdownFilterWithCheckbox";

export const FilteringDropdowns = () => {
  const options = [
    {
      text: "Logo Options",
      opened: false,
      linkedElement: (
        <DropdownFilterWithCheckbox initOptions={getFilterOptions("logo")} />
      ),
    },
    {
      text: "Seller Details",
      opened: false,
      linkedElement: (
        <DropdownFilterWithCheckbox initOptions={getFilterOptions("seller")} />
      ),
    },
    {
      text: "Budget",
      opened: false,
      linkedElement: <BudgetDropDownMenu />,
    },
    {
      text: "Delivery Time",
      opened: false,
      linkedElement: <DeliveryTimeDropDownMenu />,
    },
  ];
  const [option, setOption] = useState(options);

  return (
    <View
      style={{
        flexDirection: "row",
        zIndex: 1,
        marginBottom: layout.padding_x2,
        justifyContent: "center",
      }}
    >
      {option.map((item, index) => (
        <View key={index}>
          <TertiaryBox
            width={160}
            height={50}
            mainContainerStyle={{ borderColor: "white" }}
            style={{ marginRight: 15 }}
          >
            <TouchableOpacity
              onPress={() => {
                const newValue = !option[index].opened;
                setOption([
                  ...option.map((item) => {
                    item.opened = false;
                    return item;
                  }),
                ]); // reset
                option[index].opened = newValue;
                setOption([...option]);
              }}
              style={{
                marginRight: 5,
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <SVG source={sort} width={16} height={16} />
              <BrandText style={fontSemibold14}>{item.text}</BrandText>

              {item.opened ? (
                <SVG source={chevronUp} width={16} height={16} />
              ) : (
                <SVG source={chevronDown} width={16} height={16} />
              )}
            </TouchableOpacity>
          </TertiaryBox>
          {item.opened && item.linkedElement}
        </View>
      ))}
    </View>
  );
};
