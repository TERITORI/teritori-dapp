/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NSModal {
  type ModalBaseProps = {
    label?: string | React.FC | ViewComponent;
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
  };
}
