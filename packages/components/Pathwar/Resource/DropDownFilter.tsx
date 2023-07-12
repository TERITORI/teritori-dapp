import Checkbox from "expo-checkbox";
import React, { useRef } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";

import SortIcon from "../../../../assets/icons/Pathwar/sortIcon.svg";
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";
import { useDropdowns } from "../../../context/DropdownsProvider";
import { CategoryFilter, TagFilter } from "../../../screens/Pathwar/types";
import {
  codGrayColor,
  neutral11,
  neutral44,
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
  console.log(categories, tags);
  const dropdownRef = useRef<View>(null);

  const handleAllButton = () => {
    setCategoryFilter(
      categories.map((category) => {
        return { ...category, selected: false };
      })
    );
    setCategoryFilter(
      tags.map((tags) => {
        return { ...tags, selected: false };
      })
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
          height={350}
          style={{
            position: "absolute",
            top: 42,
            marginTop: layout.padding_x1_5,
          }}
          mainContainerStyle={{ backgroundColor: codGrayColor }}
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
                marginLeft: layout.padding_x4,
                marginTop: layout.padding_x1_5,
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

            <Separator
              style={{
                borderBottomWidth: 1,
                borderColor: neutral44,
                width: "100%",
                marginTop: layout.padding_x0_5,
                marginBottom: layout.padding_x0_5,
              }}
              color={neutral44}
            />

            <View
              style={{
                marginLeft: layout.padding_x4,
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
                Tags
              </BrandText>
            </View>

            <View
              style={{
                marginLeft: 65,
                marginRight: layout.padding_x2,
              }}
            >
              {tags.map((tag) => {
                return (
                  <View
                    style={{
                      marginTop: layout.padding_x2,
                      flexDirection: "row",
                    }}
                  >
                    <Checkbox
                      value={tag.selected}
                      onValueChange={() => {
                        setTagFilter({
                          ...tags,
                          ...{ ...tag, selected: !tag.selected },
                        });
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
            <Separator
              style={{
                borderBottomWidth: 1,
                borderColor: neutral44,
                width: "100%",
                marginTop: layout.padding_x0_5,
                marginBottom: layout.padding_x0_5,
              }}
              color={neutral44}
            />
            <View style={{ marginLeft: layout.padding_x4 }}>
              <View
                style={{
                  marginLeft: layout.padding_x4,
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
                  Categories
                </BrandText>
              </View>

              <View
                style={{
                  marginTop: layout.padding_x2_5,
                  marginLeft: layout.padding_x4,
                  marginBottom: layout.padding_x0_5,
                  marginRight: layout.padding_x2,
                }}
              >
                {categories.map((category) => {
                  return (
                    <View
                      style={{
                        marginTop: layout.padding_x2,
                        flexDirection: "row",
                      }}
                    >
                      <Checkbox
                        value={category.selected}
                        onValueChange={() => {
                          setCategoryFilter({
                            ...categories,
                            ...{ ...category, selected: !category.selected },
                          });
                        }}
                        color={
                          category.selected ? primaryColor : secondaryColor
                        }
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
                        {category.text}
                      </BrandText>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </SecondaryBox>
      )}
    </View>
  );
};
