import React from "react";

import { PrimaryButton } from "../../buttons/PrimaryButton";

export interface PublishButtonProps {
  onPress: () => void;
  text: string;
  loading?: boolean;
}

export const PublishButton: React.FC<PublishButtonProps> = ({
  onPress,
  text,
  loading,
}) => {
  return (
    <PrimaryButton
      disabled={loading}
      loader={loading}
      text={text}
      size="M"
      onPress={onPress}
    />
  );
};
