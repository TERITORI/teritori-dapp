import React, {
  FC,
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  TextStyle,
} from "react-native";

import { Label, TextInputCustom } from "./TextInputCustom";
import chevronDownSVG from "../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../assets/icons/chevron-up.svg";
import lockSVG from "../../../assets/icons/lock.svg";
import {
  neutral00,
  neutral33,
  neutral77,
  neutralA3,
  secondaryColor,
} from "../../utils/style/colors";
import { fontMedium13, fontSemibold14 } from "../../utils/style/fonts";
import { layout } from "../../utils/style/layout";
import { BrandText } from "../BrandText";
import { SVG } from "../SVG";
import { CustomPressable } from "../buttons/CustomPressable";
import { SpacerColumn, SpacerRow } from "../spacer";

export type SelectInputItem = {
  label: string;
  value: string;
  iconComponent?: ReactElement;
};

type Props = {
  data: SelectInputItem[];
  placeHolder?: string;
  selectedItem: SelectInputItem;
  selectItem: (item: SelectInputItem) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  boxStyle?: StyleProp<ViewStyle>;
  label?: string;
  isRequired?: boolean;
  allowSearchValue?: boolean;
  name?: string;
  isLoading?: boolean;
  renderItem?: ({
    onPressItem,
    item,
  }: {
    onPressItem: (item: SelectInputItem) => void;
    item: SelectInputItem;
  }) => JSX.Element;
};

export const SelectInput: React.FC<Props> = ({
  data,
  placeHolder,
  selectedItem,
  selectItem,
  disabled,
  style,
  boxStyle,
  label,
  isRequired,
  allowSearchValue,
  name,
  isLoading,
  renderItem,
}) => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [hovered, setHovered] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const selectableData = useMemo(
    () =>
      allowSearchValue && searchValue
        ? // selectableData depends on searchValue
          data.filter((d) =>
            d.label.toLowerCase().includes(searchValue.toLowerCase()),
          )
        : // Or selectableData is just the given data
          data,
    [allowSearchValue, data, searchValue],
  );

  // It obliges the user to select a value from the list to trigger a valid selectItem. The searchValue will not be used as selectedItem.
  // Also, after the user selected a value, if he modifies the searchValue, he will have to re-select a value from the list.
  useEffect(() => {
    if (
      allowSearchValue &&
      selectedItem.label &&
      searchValue !== selectedItem.label
    ) {
      selectItem({ label: "", value: "" });
    }
  }, [allowSearchValue, searchValue, selectItem, selectedItem]);

  useEffect(() => {
    if (!selectableData.length) {
      setOpenMenu(false);
    }
  }, [selectableData]);

  const getScrollViewStyle = () => {
    if (selectableData.length > 5) {
      return [dropdownMenuStyle, { height: 200 }];
    }
    return dropdownMenuStyle;
  };

  const onPressItem = (item: SelectInputItem) => {
    selectItem(item);
    setSearchValue(item.label);
    setOpenMenu(false);
  };

  return (
    <CustomPressable
      style={[style, { position: "relative", zIndex: 999 }]}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => {
        if (!disabled || selectableData.length) setOpenMenu((value) => !value);
      }}
      disabled={disabled || !selectableData.length}
    >
      {label && (
        <>
          <Label
            hovered={hovered}
            style={{ color: neutralA3 }}
            isRequired={isRequired}
          >
            {label}
          </Label>
          <SpacerColumn size={1.5} />
        </>
      )}
      <View>
        <View
          style={[
            selectInputStyle,
            hovered && { borderColor: secondaryColor },
            boxStyle,
          ]}
        >
          <View style={iconLabelStyle}>
            {selectedItem.iconComponent && (
              <>
                {selectedItem.iconComponent}
                <SpacerRow size={1} />
              </>
            )}

            {allowSearchValue ? (
              <TextInputCustom
                placeHolder={placeHolder}
                name={name || ""}
                hideLabel
                label=""
                variant="noStyle"
                value={searchValue}
                onChangeText={(text) => {
                  setSearchValue(text);
                  setOpenMenu(!!selectableData.length);
                }}
                rules={{ required: isRequired }}
                style={{ flex: 1 }}
                containerStyle={{ flex: 1 }}
                boxMainContainerStyle={{ flex: 1 }}
                textInputStyle={{ width: "100%" }}
                disabled={disabled || isLoading}
              />
            ) : (
              <BrandText
                style={[
                  fontSemibold14,
                  { color: selectedItem ? secondaryColor : neutral77 },
                ]}
              >
                {selectedItem?.label ? selectedItem.label : placeHolder}
              </BrandText>
            )}
          </View>

          {isLoading ? (
            <ActivityIndicator
              color={secondaryColor}
              style={{ marginLeft: layout.spacing_x1_5 }}
            />
          ) : (
            <SVG
              source={
                !selectableData.length || disabled
                  ? lockSVG
                  : openMenu
                    ? chevronUpSVG
                    : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
              style={{ marginLeft: layout.spacing_x1_5 }}
            />
          )}
        </View>

        {/*TODO: If the opened menu appears under other elements, you'll may need to set zIndex:-1 or something to these elements*/}
        {openMenu && (
          <ScrollView style={getScrollViewStyle()}>
            {data?.map((item, index) => (
              <Fragment key={index}>
                {renderItem ? (
                  renderItem({ onPressItem, item })
                ) : (
                  <SelectInputItemComponent item={item} onPress={onPressItem} />
                )}
              </Fragment>
            ))}
          </ScrollView>
        )}
      </View>
    </CustomPressable>
  );
};

export const SelectInputItemComponent: FC<{
  onPress: (item: SelectInputItem) => void;
  item: SelectInputItem;
  isLoading?: boolean;
}> = ({ onPress, item, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <CustomPressable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPress={() => onPress(item)}
      style={dropdownMenuRowStyle}
      disabled={isLoading}
    >
      <View
        style={[iconLabelStyle, (isHovered || isLoading) && { opacity: 0.5 }]}
      >
        {item.iconComponent && (
          <>
            {item.iconComponent}
            <SpacerRow size={1.5} />
          </>
        )}
        <BrandText style={dropdownMenuTextStyle}>{item.label}</BrandText>
      </View>

      {isLoading && <ActivityIndicator color={secondaryColor} />}
    </CustomPressable>
  );
};

const selectInputStyle: ViewStyle = {
  backgroundColor: neutral00,
  borderColor: neutral33,
  borderWidth: 1,
  borderRadius: 12,
  padding: layout.spacing_x1_5,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
};
const iconLabelStyle: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  flex: 1,
};
const dropdownMenuStyle: ViewStyle = {
  backgroundColor: "#292929",
  borderWidth: 1,
  borderColor: neutral33,
  borderRadius: 12,
  padding: layout.spacing_x1,
  position: "absolute",
  top: 52,
  width: "100%",
  maxHeight: 330,
  zIndex: 10,
};
const dropdownMenuTextStyle: TextStyle = fontMedium13;
const dropdownMenuRowStyle: ViewStyle = {
  borderRadius: 6,
  padding: layout.spacing_x1,
  flexDirection: "row",
  justifyContent: "space-between",
};
