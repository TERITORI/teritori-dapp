import React from "react";

import ModalBase from "./ModalBase";
import { BrandText } from "../BrandText";

export const QRCodeScannerModal = ({
  onClose,
}: {
  onClose: (data?: string) => void;
}) => {
  return (
    <ModalBase label="Scan QR" onClose={onClose} visible width={400}>
      <BrandText>Scan is not available on web</BrandText>
    </ModalBase>
  );
};
