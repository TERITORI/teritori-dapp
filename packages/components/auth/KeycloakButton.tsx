import { StyleProp } from "react-native";

import { useKeycloak } from "../../context/web3auth/KeycloakProvider";
import { BoxStyle } from "../boxes/Box";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";

export const KeycloakButton: React.FC<{ style?: StyleProp<BoxStyle> }> = ({
  style,
}) => {
  const { authenticated, login, logout, ready, disabled } = useKeycloak();
  const Button = authenticated || !ready ? SecondaryButton : PrimaryButton;
  const sp = [{ width: 100 }, style];
  return (
    <Button
      loader
      size="XS"
      disabled={disabled}
      isLoading={!ready}
      text={authenticated ? "Logout" : "Login"}
      onPress={authenticated ? logout : login}
      style={sp}
      boxStyle={sp}
    />
  );
};
