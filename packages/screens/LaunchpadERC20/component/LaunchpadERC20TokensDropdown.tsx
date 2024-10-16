import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface LaunchpadERC20TokensDropdownProps {
    items: string[];
    placeholder?: string;
}

export const LaunchpadERC20TokensDropdown: React.FC<LaunchpadERC20TokensDropdownProps> = ({ items, placeholder = "Select an item" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectItem = (item: string) => {
        setSelectedItem(item);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            {/* Dropdown Button (TextInput style) */}
            <TouchableOpacity onPress={toggleDropdown} style={styles.inputField}>
                <Text style={styles.inputText}>
                    {selectedItem ? selectedItem : placeholder}
                </Text>
            </TouchableOpacity>

            {/* Dropdown Modal for Items */}
            {isOpen && (
                <View style={styles.dropdownMenu}>
                    {items.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => selectItem(item)} style={styles.dropdownItem}>
                            <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
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
        fontSize: 16,
        color: '#333',
    },
});