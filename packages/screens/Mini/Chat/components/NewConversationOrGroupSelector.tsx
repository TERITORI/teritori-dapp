import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { CreateGroupModal } from "./CreateGroupModal";
import chevronGrayRightSVG from "../../../../../assets/icons/chevron-right-gray.svg";
import { BrandText } from "../../../../components/BrandText";
import { SVG } from "../../../../components/SVG";
import { CustomPressable } from "../../../../components/buttons/CustomPressable";
import { Separator } from "../../../../components/separators/Separator";
import { SpacerColumn, SpacerRow } from "../../../../components/spacer";
import { neutral22 } from "../../../../utils/style/colors";
import {
  fontBold10,
  fontMedium16,
  fontSemibold12,
} from "../../../../utils/style/fonts";
import { layout } from "../../../../utils/style/layout";
import { CustomButton } from "../../components/Button/CustomButton";
import { ChatAvatar } from "../../components/ChatAvatar";
import Checkbox from "../../components/Checkbox/Checkbox";

export type ContactSelectionType = {
  id: string;
  name: string;
  avatar: string | string[];
  conversationId?: string;
};

type Props = {
  contacts: ContactSelectionType[];
  isGroupSelector?: boolean;
  onPressContact?: (contact: ContactSelectionType) => void;
  onCreateGroup?: (
    selectedContact: ContactSelectionType[],
    groupName: string,
  ) => void;
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
  const [groupName, setGroupName] = useState("");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleContactSelection = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts((prev) => prev.filter((x) => x !== id));
    } else {
      setSelectedContacts((prev) => [...prev, id]);
    }
  };

  const openCreateGroupConfirmationModal = () => {
    setOpenConfirmation(true);
  };

  const handleCreateGroupPress = async () => {
    if (selectedContacts.length === 0) {
      return;
    }

    if (!openConfirmation) {
      openCreateGroupConfirmationModal();
      return;
    }

    if (onCreateGroup) {
      const selectedContactsGroup = contacts.filter((x) =>
        selectedContacts.includes(x.id),
      );
      setLoading(true);
      await onCreateGroup(selectedContactsGroup, groupName);
      setLoading(false);
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

  const groupContactsWithAlphabet = (contacts: ContactSelectionType[]) => {
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
      {} as Record<string, ContactSelectionType[]>,
    );

    return Object.keys(groupedContacts)
      .sort()
      .reduce(
        (obj, key) => {
          obj[key] = groupedContacts[key];
          return obj;
        },
        {} as Record<string, ContactSelectionType[]>,
      );
  };

  const alphaGroupedContacts = useMemo(
    () => groupContactsWithAlphabet(contacts),
    [contacts],
  );

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <ScrollView
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
                    <BrandText style={[fontSemibold12]}>
                      {key.toUpperCase()}
                    </BrandText>
                  </View>
                  <SpacerColumn size={2} />
                  {Array.isArray(val) &&
                    val.map((contact, idx) => (
                      <React.Fragment key={`${contact.name}-${idx}`}>
                        <IndividualFriendName
                          enableSelection={isGroupSelector}
                          isSelected={selectedContacts.includes(contact.id)}
                          onSelection={(id) => toggleContactSelection(id)}
                          avatar={contact.avatar}
                          key={contact.id}
                          id={contact.id}
                          name={contact.name}
                          lastItem={val.length - 1 === idx}
                          onPress={() => {
                            if (onPressContact && !isGroupSelector) {
                              onPressContact(contact);
                            }
                            if (isGroupSelector) {
                              toggleContactSelection(contact.id);
                            }
                          }}
                        />
                        <SpacerColumn size={2} />
                      </React.Fragment>
                    ))}
                </View>
              ))}
          </View>
          <SpacerColumn size={8} />
        </View>
      </ScrollView>
      <AlbhabetsSelector onPress={(x) => scrollHandler(x)} />

      <CustomButton
        onPress={handleCreateGroupPress}
        title="Create"
        style={{
          position: "absolute",
          bottom: 40,
          zIndex: 99,
        }}
        isDisabled={loading}
      />
      <CreateGroupModal
        isOpen={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onCreate={handleCreateGroupPress}
        selected={contacts.reduce((acc, val) => {
          if (selectedContacts.includes(val.id)) {
            acc.push(val.name);
          }
          return acc;
        }, [] as string[])}
        groupName={groupName}
        setGroupName={setGroupName}
      />
    </View>
  );
};

type IndividualFriendNameProps = ContactSelectionType & {
  onPress?: () => void;
  enableSelection?: boolean;
  isSelected?: boolean;
  lastItem: boolean;
  onSelection: (id: string) => void;
};

const IndividualFriendName = React.memo(
  ({
    avatar,
    id,
    name,
    onPress,
    enableSelection = false,
    isSelected = false,
    lastItem,
    onSelection,
  }: IndividualFriendNameProps) => {
    const onFriendNamePress = () => {
      if (onPress) {
        onPress();
      }
    };

    return (
      <>
        <View style={{ flexDirection: "row" }}>
          <CustomPressable
            onPress={onFriendNamePress}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: layout.spacing_x1_5,
              flex: 1,
            }}
          >
            <ChatAvatar
              membersAvatar={typeof avatar === "string" ? [avatar] : avatar}
              hideStatusIndicator
              size="sm"
            />
            <View>
              <BrandText style={[fontMedium16, { lineHeight: 22 }]}>
                {name}
              </BrandText>
            </View>
          </CustomPressable>

          <View>
            {!enableSelection && (
              <SVG source={chevronGrayRightSVG} height={24} width={24} />
            )}
            {enableSelection && (
              <>
                <Checkbox
                  isChecked={isSelected}
                  onPress={(_, id) => onSelection(id as string)}
                  value={id}
                  type="circle"
                  size="md"
                />
              </>
            )}

            <SpacerRow size={3.5} />
          </View>
        </View>
        <SpacerColumn size={2} />
        {!lastItem && (
          <Separator
            style={{
              height: 0.9,
              backgroundColor: "rgba(84, 84, 88, 0.65)",
            }}
          />
        )}
      </>
    );
  },
);

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
        right: -18,
      }}
    >
      {Array.isArray(alphabet) &&
        alphabet.map((alph) => (
          <CustomPressable key={alph} onPress={() => onPress(alph)}>
            <BrandText style={[fontBold10]}>{alph.toUpperCase()}</BrandText>
          </CustomPressable>
        ))}
    </View>
  );
};
