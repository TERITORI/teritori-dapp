import { View } from "react-native";

import { Button } from "../components/button/Button";

export const Russian = () => {
  const click = () => {};
  return (
    <View>
      <Button onPress={click} text="PLAY" withImg />
    </View>
  );
};
