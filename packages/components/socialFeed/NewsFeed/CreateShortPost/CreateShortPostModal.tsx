import React from "react";
import { useWindowDimensions } from "react-native";
import { MenuProvider } from "react-native-popup-menu";

import { layout } from "../../../../utils/style/layout";
import ModalBase from "../../../modals/ModalBase";
import { NewsFeedInput } from "../NewsFeedInput";

export const CreateShortPostModal: React.FC<{
  onClose: () => void;
  label: string;
  isVisible?: boolean;
  additionalMention?: string;
  additionalHashtag?: string;
  onSubmitSuccess?: () => void;
  daoId?: string;
}> = ({
  onClose,
  label,
  isVisible,
  additionalMention,
  additionalHashtag,
  onSubmitSuccess,
  daoId,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={windowWidth}
      label={label}
    >
      <MenuProvider>
        <NewsFeedInput
          daoId={daoId}
          onCloseCreateModal={onClose}
          type="post"
          onSubmitSuccess={onSubmitSuccess}
          style={{
            marginBottom: layout.spacing_x2_5,
            paddingVertical: 70,
            width: "100%",
          }}
          additionalMention={additionalMention}
          additionalHashtag={additionalHashtag}
        />
      </MenuProvider>
    </ModalBase>
  );
};
