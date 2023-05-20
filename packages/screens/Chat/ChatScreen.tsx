import { useState } from "react";

import { BrandText } from "../../components/BrandText";
import { ScreenContainer } from "../../components/ScreenContainer";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { ScreenFC } from "../../utils/navigation";
import { createWeshClient } from "../../weshnet";

/*
  To test this:
  - run `go run ./go/cmd/weshd` at root
  - navigate to `/chat` in teritori ui
  - click `Test` button
*/

export const ChatScreen: ScreenFC<"Chat"> = () => {
  const [text, setText] = useState("");
  return (
    <ScreenContainer>
      <PrimaryButton
        size="M"
        text="Test"
        loader
        onPress={async () => {
          try {
            const weshClient = createWeshClient("http://localhost:4242");
            const weshConfig = await weshClient.ServiceGetConfiguration({});
            console.log("wesh test success", weshConfig);
            setText(JSON.stringify(weshConfig));
          } catch (err) {
            console.error("wesh test error", err);
            setText(`${err}`);
          }
        }}
      />
      <BrandText>{text}</BrandText>
    </ScreenContainer>
  );
};
