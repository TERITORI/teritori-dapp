import { LegacyTertiaryBox } from '@/components/boxes/LegacyTertiaryBox';
import { TertiaryBox } from '@/components/boxes/TertiaryBox';
import { BrandText } from '@/components/BrandText';
import { Label } from '@/components/inputs/TextInputCustom';
import { useDropdowns } from '@/hooks/useDropdowns';
import { neutral17, neutral77, secondaryColor } from '@/utils/style/colors';
import { fontSemibold14, fontSemibold16 } from '@/utils/style/fonts';
import { layout } from '@/utils/style/layout';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { SVG } from '@/components/SVG';
import chevronDownSVG from "../../../../assets/icons/chevron-down.svg";
import chevronUpSVG from "../../../../assets/icons/chevron-up.svg";

interface LaunchpadERC20TokensDropdownProps {
    items: string[];
    placeholder?: string;
}

export const LaunchpadERC20TokensDropdown: React.FC<LaunchpadERC20TokensDropdownProps> = ({ items, placeholder = "Select an item" }) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [isDropdownOpen, setDropdownState, ref] = useDropdowns();

    const selectItem = (item: string) => {
        setSelectedItem(item);;
    };

    return (
        <View>
            <Label style={{ marginBottom: layout.spacing_x1 }} isRequired>
                Hello
            </Label>

            <TertiaryBox
                style={{
                    width: "100%",
                    height: 40,
                    flexDirection: "row",
                    paddingHorizontal: 12,
                    backgroundColor: neutral17,
                    alignItems: "center",
                }}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flex: 1,
                    }}
                    activeOpacity={1}
                    onPress={() => setDropdownState()}
                >
                    <BrandText
                        style={[
                            fontSemibold14,
                            { marginRight: layout.spacing_x1, color: neutral77 },
                        ]}
                    >
                        Select your Token
                    </BrandText>
                    <SVG
                        source={isDropdownOpen ? chevronUpSVG : chevronDownSVG}
                        width={16}
                        height={16}
                        color={secondaryColor}
                    />
                </TouchableOpacity>
            </TertiaryBox>
            <View style={styles.container}>
                <LegacyTertiaryBox
                    width={416}
                    mainContainerStyle={[
                        {
                            paddingHorizontal: layout.spacing_x2,
                            paddingTop: layout.spacing_x2,
                            backgroundColor: neutral17,
                            alignItems: "flex-start",
                        },
                    ]}
                >
                    {items && items.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={{
                                marginBottom: layout.spacing_x2,
                                opacity: 1,
                            }}
                            onPress={() => selectItem(item)}
                        >
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <BrandText style={[fontSemibold16, { marginLeft: layout.spacing_x1_5 }]}>{item}</BrandText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </LegacyTertiaryBox>
            </View >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
    },
    inputField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    inputText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownMenu: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {

    },
});