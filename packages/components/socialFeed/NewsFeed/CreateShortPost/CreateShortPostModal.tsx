import React from "react";
import { MenuProvider } from "react-native-popup-menu";

import { useFetchFeed } from "../../../../hooks/useFetchFeed";
import { useAppNavigation } from "../../../../utils/navigation";
import { layout, NEWS_FEED_MAX_WIDTH } from "../../../../utils/style/layout";
import ModalBase from "../../../modals/ModalBase";
import { NewPostFormValues } from "../NewsFeed.type";
import { NewsFeedInput } from "../NewsFeedInput";

export const CreateShortPostModal: React.FC<{
  onClose: () => void;
  isVisible?: boolean;
}> = ({ onClose, isVisible }) => {
  const { refetch } = useFetchFeed();
  const navigation = useAppNavigation();

  const onPressCreateArticle = (formValues: NewPostFormValues) => {
    navigation.navigate("FeedNewPost", formValues);
    onClose();
  };

  return (
    <ModalBase
      visible={isVisible}
      onClose={onClose}
      width={NEWS_FEED_MAX_WIDTH}
      label="Create a Post"
    >
      <MenuProvider>
        <NewsFeedInput
          onPressCreateArticle={onPressCreateArticle}
          onCloseCreateModal={onClose}
          type="post"
          onSubmitSuccess={refetch}
          style={{ marginBottom: layout.padding_x2_5, paddingVertical: 70 }}
        />
      </MenuProvider>
    </ModalBase>
  );
};
