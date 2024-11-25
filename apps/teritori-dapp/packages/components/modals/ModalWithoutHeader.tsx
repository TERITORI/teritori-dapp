import React from "react";

import ModalBase, { ModalBaseProps } from "./ModalBase";

interface ModalWithoutHeaderProps extends ModalBaseProps {}

export const ModalWithoutHeader: React.FC<ModalWithoutHeaderProps> = ({
  ...props
}) => <ModalBase hideHeader {...props} />;
