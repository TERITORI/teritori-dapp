import React, { useState } from "react";
import { ScrollView, View } from "react-native";

import chevronGrayRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { OptimizedImage } from "../../../../components/OptimizedImage";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import { blueDefault, neutral22 } from "../../../../utils/style/colors";
import {
  fontBold11,
  fontMedium16,
  fontSemibold12,
  fontSemibold15,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomCheckbox } from "../../components/CustomCheckbox";

const fake_url =
  "https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg";

type ContactType = {
  id: string;
  name: string;
  avatar: string;
};
type Props = {
  contacts: ContactType[];
  isGroupSelector?: boolean;
  onPressContact?: (contact: ContactType) => void;
  onCreateGroup?: (selectedContact: ContactType[]) => void;
};

export const NewConversationOrGroupSelector = ({
  contacts,
  isGroupSelector = false,
  onCreateGroup,
  onPressContact,
}: Props) => {
  const [dataSourceCords, setDataSourceCords] = useState<
    Record<string, number>
  >({});
  const [ref, setRef] = useState<ScrollView | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const toggleContactSelection = (id: string) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleCreateGroupPress = () => {
    if (onCreateGroup) {
      const selectedContactsGroup = contacts.filter((x) =>
        selectedContacts.includes(x.id),
      );
      onCreateGroup(selectedContactsGroup);
    }
  };

  const scrollHandler = (scrollToIndex: string) => {
    if (ref) {
      ref.scrollTo({
        x: 0,
        y: dataSourceCords[scrollToIndex],
        animated: true,
      });
    }
  };

  const groupContactsWithAlphabet = (contacts: ContactType[]) => {
    const groupedContacts = contacts.reduce(
      (acc, val) => {
        const firstCharacter = val.name.toLowerCase().charAt(0);
        if (Object.keys(acc).includes(firstCharacter)) {
          acc[firstCharacter].push(val);
        } else {
          acc[firstCharacter] = [val];
        }
        return acc;
      },
      {} as Record<string, ContactType[]>,
    );

    return Object.keys(groupedContacts)
      .sort()
      .reduce(
        (obj, key) => {
          obj[key] = groupedContacts[key];
          return obj;
        },
        {} as Record<string, ContactType[]>,
      );
  };
  const alphaGroupedContacts = groupContactsWithAlphabet(contacts);
  return (
    <View style={{ position: "relative", flex: 1 }}>
      <ScrollView
        style={{}}
        ref={(ref) => {
          setRef(ref);
        }}
      >
        <View
          style={{
            flex: 1,
          }}
        >
          <View>
            {alphaGroupedContacts &&
              Object.keys(alphaGroupedContacts).length > 0 &&
              Object.entries(alphaGroupedContacts).map(([key, val], index) => (
                <View
                  key={`${key}-${index}`}
                  style={{ marginBottom: layout.spacing_x1_5 }}
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    dataSourceCords[key] = layout.y;
                    setDataSourceCords(dataSourceCords);
                  }}
                >
                  <View
                    style={{
                      backgroundColor: neutral22,
                      alignSelf: "flex-start",
                      paddingVertical: layout.spacing_x0_5,
                      paddingHorizontal: layout.spacing_x1_5,
                      borderRadius: 32,
                    }}
                  >
                    <BrandText style={[fontSemibold12, {}]}>
                      {key.toUpperCase()}
                    </BrandText>
                  </View>
                  {Array.isArray(val) &&
                    val.map((contact, idx) => (
                      <React.Fragment key={`${contact.name}-${idx}`}>
                        <IndividualFriendName
                          enableSelection={isGroupSelector}
                          isSelected={selectedContacts.includes(contact.id)}
                          onSelection={(id) => toggleContactSelection(id)}
                          avatar={fake_url}
                          id={contact.id}
                          name={contact.name}
                          onPress={() => {
                            if (onPressContact && !isGroupSelector) {
                              onPressContact(contact);
                            }
                            if (isGroupSelector) {
                              toggleContactSelection(contact.id);
                            }
                          }}
                        />
                        {val.length > idx + 1 && (
                          <Separator color="rgba(84, 84, 88, 0.65)" />
                        )}
                      </React.Fragment>
                    ))}
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
      <AlbhabetsSelector onPress={(x) => scrollHandler(x)} />
      <CustomPressable
        onPress={handleCreateGroupPress}
        style={{
          backgroundColor: blueDefault,
          position: "absolute",
          bottom: 40,
          left: layout.spacing_x2,
          right: layout.spacing_x2,
          paddingVertical: layout.spacing_x1_5,
          zIndex: 99,
          borderRadius: 100,
        }}
      >
        <BrandText style={[fontSemibold15, { textAlign: "center" }]}>
          Create
        </BrandText>
      </CustomPressable>
    </View>
  );
};

type IndividualFriendNameProps = ContactType & {
  onPress?: () => void;
  enableSelection?: boolean;
  isSelected?: boolean;
  onSelection?: (id: string) => void;
};
const IndividualFriendName = ({
  avatar,
  id,
  name,
  onPress,
  enableSelection = false,
  isSelected = false,
  onSelection,
}: IndividualFriendNameProps) => {
  const onFriendNamePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const onCheckboxPress = () => {
    if (onSelection) {
      onSelection(id);
    }
  };
  return (
    <CustomPressable
      onPress={onFriendNamePress}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: layout.spacing_x2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: layout.spacing_x1_5,
          alignItems: "center",
        }}
      >
        <OptimizedImage
          width={22}
          height={22}
          sourceURI={avatar}
          style={{
            width: 22,
            height: 22,
            borderRadius: 22 / 2,
          }}
        />
        <BrandText style={[fontMedium16, { lineHeight: 22 }]}>{name}</BrandText>
      </View>
      {!enableSelection && (
        <SVG source={chevronGrayRightSVG} height={24} width={24} />
      )}
      {enableSelection && (
        <CustomCheckbox isChecked={isSelected} onPress={onCheckboxPress} />
      )}
    </CustomPressable>
  );
};

type AlphabetSelectorProps = {
  onPress: (alphabet: string) => void;
};
const alphabet = "abcdefghijklmnopqrstuvwxyz#149".split("");
const AlbhabetsSelector = ({ onPress }: AlphabetSelectorProps) => {
  return (
    <View
      style={{
        gap: layout.spacing_x0_75,
        position: "absolute",
        right: -20,
        top: 10,
      }}
    >
      {Array.isArray(alphabet) &&
        alphabet.map((alph) => (
          <CustomPressable key={alph} onPress={() => onPress(alph)}>
            <BrandText style={[fontBold11]}>{alph.toUpperCase()}</BrandText>
          </CustomPressable>
        ))}
    </View>
  );
};
