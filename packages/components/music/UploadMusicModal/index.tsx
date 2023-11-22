import { FC, useState } from "react";

import { UploadTrack } from "./UploadTrack";
import ModalBase from "../../modals/ModalBase";
import { SpacerColumn } from "../../spacer";

enum UploadMode {
  SINGLE_TRACK,
  ALBUM,
}

const UPLOAD_MUSIC_MODAL_WIDTH = 564;

export const UploadMusicModal: FC<{
  onClose: () => void;
  isVisible: boolean;
}> = ({ onClose, isVisible }) => {
  const [uploadMode] = useState(UploadMode.SINGLE_TRACK);
  return (
    <ModalBase
      label={
        uploadMode === UploadMode.SINGLE_TRACK
          ? "Upload single track"
          : "Upload album"
      }
      visible={isVisible}
      onClose={onClose}
      width={UPLOAD_MUSIC_MODAL_WIDTH}
    >
      <SpacerColumn size={2} />
      {uploadMode === UploadMode.SINGLE_TRACK ? (
        <UploadTrack onUploadDone={onClose} />
      ) : (
        <>{/*TODO*/}</>
      )}
    </ModalBase>
  );
};
