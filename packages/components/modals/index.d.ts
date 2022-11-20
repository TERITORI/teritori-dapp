namespace NSModal {
    type ModalBaseProps = {
        label?: string;
        onClose?: () => void;
        onBackPress?: () => void;
        width?: number;
        visible?: boolean;
        Header?: ComponentType;
        childrenBottom?: JSX.Element | JSX.Element[];
        hideMainSeparator?: boolean;
        description?: string;
        noBrokenCorners?: boolean;
        scrollable?: boolean;
        contentStyle?: ViewStyle;
        containerStyle?: ViewStyle;
    }
}