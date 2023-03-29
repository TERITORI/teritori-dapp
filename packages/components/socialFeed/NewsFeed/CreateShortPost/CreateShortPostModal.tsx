import React from "react";
import { MenuProvider } from "react-native-popup-menu";

import { layout, NEWS_FEED_MAX_WIDTH } from "../../../../utils/style/layout";
import ModalBase from "../../../modals/ModalBase";
import { NewsFeedInput } from "../NewsFeedInput";

export const CreateShortPostModal: React.FC<{
  onClose: () => void;
  isVisible?: boolean;
  additionalMention?: string;
  additionalHashtag?: string;
  onSubmitSuccess?: () => void;
}> = ({
  onClose,
  isVisible,
  additionalMention,
  additionalHashtag,
  onSubmitSuccess,
}) => {
  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={NEWS_FEED_MAX_WIDTH}
      label="Create a Post"
    >
      <MenuProvider>
        <NewsFeedInput
          onCloseCreateModal={onClose}
          type="post"
          onSubmitSuccess={onSubmitSuccess}
          style={{ marginBottom: layout.padding_x2_5, paddingVertical: 70 }}
          additionalMention={additionalMention}
          additionalHashtag={additionalHashtag}
        />
      </MenuProvider>
    </ModalBase>
  );
};
