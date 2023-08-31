import Checkbox from "expo-checkbox";
import React, { useRef } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import SortIcon from "../../../../assets/icons/pathwar/sortIcon.svg";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { CategoryFilter, TagFilter } from "../../../screens/Pathwar/types";
import {
  codGrayColor,
  neutral11,
  primaryColor,
  secondaryColor,
} from "../../../utils/style/colors";
import { fontSemibold14 } from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { Separator } from "../../Separator";
import { SecondaryBox } from "../../boxes/SecondaryBox";
import { TertiaryBox } from "../../boxes/TertiaryBox";

export const DropDownFilter: React.FC<{
  categories: CategoryFilter[];
  tags: TagFilter[];
  setCategoryFilter: React.Dispatch<React.SetStateAction<CategoryFilter[]>>;
  setTagFilter: React.Dispatch<React.SetStateAction<TagFilter[]>>;
}> = ({ categories, tags, setCategoryFilter, setTagFilter }) => {
  const { onPressDropdownButton, isDropdownOpen } = useDropdowns();
  const dropdownRef = useRef<View>(null);

  const handleAllButton = () => {
    onPressDropdownButton(dropdownRef);
    setCategoryFilter(
      Object.values(
        categories.map((category) => {
          return { ...category, selected: true };
        })
      )
    );
    setTagFilter(
      Object.values(
        tags.map((tags) => {
          return { ...tags, selected: true };
        })
      )
    );
  };

  return (
    <View style={{ flexDirection: "column" }}>
      <TertiaryBox
        width={181}
        height={45}
        mainContainerStyle={{
          backgroundColor: neutral11,
          borderColor: secondaryColor,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <SVG source={SortIcon} />
          <BrandText
            style={[
              {
                marginLeft: layout.padding_x0_5,
                marginRight: layout.padding_x0_5,
              },
              fontSemibold14,
            ]}
          >
            Content to Show
          </BrandText>
          <TouchableOpacity onPress={() => onPressDropdownButton(dropdownRef)}>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </View>
      </TertiaryBox>

      {/* DropDown Menu */}

      {isDropdownOpen(dropdownRef) && (
        <SecondaryBox
          width={185}
          style={{
            position: "absolute",
            top: 42,
          }}
          mainContainerStyle={{
            backgroundColor: codGrayColor,
            paddingVertical: layout.padding_x2,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <Pressable
              style={{
                marginLeft: layout.padding_x2,
                marginBottom: layout.padding_x1,
                flexDirection: "row",
              }}
              onPress={handleAllButton}
            >
              <BrandText
                style={[
                  {
                    marginLeft: layout.padding_x1_5,
                    marginRight: layout.padding_x0_5,
                  },
                  fontSemibold14,
                ]}
              >
                Show All
              </BrandText>
            </Pressable>

            <Section
              text="Tags"
              items={tags}
              setItems={setTagFilter}
              closeOpenedDropdown={() => onPressDropdownButton(dropdownRef)}
            />
            <Section
              text="Categories"
              items={categories}
              setItems={setCategoryFilter}
              closeOpenedDropdown={() => onPressDropdownButton(dropdownRef)}
            />
          </View>
        </SecondaryBox>
      )}
    </View>
  );
};

const Section: React.FC<{
  text: string;
  items: TagFilter[];
  setItems: (e: []) => void;
  closeOpenedDropdown: () => void;
}> = ({ text, items, setItems, closeOpenedDropdown }) => {
  return (
    <>
      <Separator />

      <View
        style={{
          marginLeft: layout.padding_x2,
          marginTop: layout.padding_x1,
          marginVertical: layout.padding_x1,
          flexDirection: "row",
        }}
      >
        <BrandText
          style={[
            {
              marginLeft: layout.padding_x1_5,
              marginRight: layout.padding_x0_5,
            },
            fontSemibold14,
          ]}
        >
          {text}
        </BrandText>
      </View>

      <View
        style={{
          marginLeft: layout.padding_x3,
        }}
      >
        {items.map((tag, index) => {
          return (
            <View
              style={{
                marginVertical: layout.padding_x0_5,
                marginLeft: layout.padding_x1_5,
                flexDirection: "row",
              }}
            >
              <Checkbox
                value={tag.selected}
                onValueChange={() => {
                  setItems(
                    // @ts-expect-error
                    Object.values({
                      ...items,
                      [index]: {
                        ...tag,
                        selected: !tag.selected,
                      },
                    })
                  );
                }}
                color={tag.selected ? primaryColor : secondaryColor}
              />
              <BrandText
                style={[
                  {
                    marginLeft: layout.padding_x1_5,
                    marginRight: layout.padding_x0_5,
                  },
                  fontSemibold14,
                ]}
              >
                {tag.text}
              </BrandText>
            </View>
          );
        })}
      </View>
    </>
  );
};
