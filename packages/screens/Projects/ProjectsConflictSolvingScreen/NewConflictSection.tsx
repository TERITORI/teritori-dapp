import React, { FC, useState } from "react";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { PrimaryButtonOutline } from "@/components/buttons/PrimaryButtonOutline";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { parseUserId } from "@/networks";
import { useEscrowContract } from "@/screens/Projects/hooks/useEscrowContract";
import { neutral17, neutralFF, redDefault } from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const NewConflictSection: FC<{
  projectId: string | undefined;
  userId: string | undefined;
}> = ({ projectId, userId }) => {
  const [initialMessage, setInitialMessage] = useState("");
  const [network, userAddress] = parseUserId(userId);

  const { execEscrowMethod } = useEscrowContract(
    network?.id || "",
    userAddress,
  );

  return (
    <>
      <BrandText style={[fontSemibold28, { marginBottom: layout.spacing_x3 }]}>
        New conflict
      </BrandText>
      <TertiaryBox
        style={{
          backgroundColor: neutral17,
          padding: layout.spacing_x2,
          borderWidth: 0,
          marginBottom: layout.spacing_x2,
        }}
      >
        <BrandText style={[{ color: neutralFF, alignSelf: "flex-start" }]}>
          Initial message
        </BrandText>

        <SpacerColumn size={3} />

        <TextInputCustom
          value={initialMessage}
          onChangeText={(text) => setInitialMessage(text)}
          label=""
          name="initialMessage"
          placeholder="Enter details here..."
          hideLabel
          multiline
          noBrokenCorners
          containerStyle={{ width: "100%" }}
          textInputStyle={{ height: 80 }}
        />

        <SpacerColumn size={3} />

        <PrimaryButtonOutline
          noBrokenCorners
          disabled={!initialMessage}
          size="SM"
          color={redDefault}
          text="Ask for conflict solver"
          style={{ alignSelf: "flex-end" }}
          onPress={async () => {
            const [network, userAddress] = parseUserId(userId);
            if (!network || !userAddress) {
              throw new Error("Invalid user id");
            }
            if (!projectId) {
              throw new Error("Invalid project id");
            }

            await execEscrowMethod("RequestConflictResolution", [
              projectId,
              initialMessage,
            ]);
          }}
        />
      </TertiaryBox>
    </>
  );
};
