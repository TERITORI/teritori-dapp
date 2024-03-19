import React, { useCallback, useEffect, useState } from "react";
import { View, useWindowDimensions, StyleSheet, Linking } from "react-native";
import {
  Camera,
  CameraPermissionStatus,
  Code,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";

import ModalBase from "./ModalBase";
import { useFeedbacks } from "../../context/FeedbacksProvider";

export const QRCodeScannerModal = ({
  onClose,
}: {
  onClose: (data?: string) => void;
}) => {
  const { setToast } = useFeedbacks();
  const { width, height } = useWindowDimensions();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>("not-determined");

  const device = useCameraDevice("back");

  const onCodeScanned = useCallback(
    (codes: Code[]) => {
      const data = codes[0]?.value;

      if (
        typeof data === "string" &&
        data.startsWith("https://app.teritori.com/")
      ) {
        onClose(data);
      } else {
        setToast({
          mode: "normal",
          title: "QR Error",
          message: "QR is not of Teritori",
        });
      }
    },
    [onClose, setToast],
  );

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned,
  });

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === "denied") await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus !== "granted") {
      requestCameraPermission();
    }
  }, [cameraPermissionStatus, requestCameraPermission]);

  return (
    <ModalBase label="Scan QR" onClose={onClose} visible width={width}>
      <View
        style={{
          height: height - 180,
          width: "100%",
        }}
      >
        <>
          {device !== undefined && (
            <Camera
              isActive
              device={device}
              style={StyleSheet.absoluteFill}
              codeScanner={codeScanner}
            />
          )}
        </>
      </View>
    </ModalBase>
  );
};
