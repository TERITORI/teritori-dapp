import { FC, useState } from "react";

import { UploadAlbum } from "./UploadAlbum";
import { UploadTrack } from "./UploadTrack";
import ModalBase from "../../../../components/modals/ModalBase";
import { SpacerColumn } from "../../../../components/spacer";

interface UploadAlbumModalProps {
  onClose: () => void;
  isVisible: boolean;
}

enum UploadMode {
  SINGLE_TRACK,
  ALBUM,
}

const UPLOAD_ALBUM_MODAL_WIDTH = 564;

export const UploadMusicModal: FC<UploadAlbumModalProps> = ({
  onClose,
  isVisible,
}) => {
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
      width={UPLOAD_ALBUM_MODAL_WIDTH}
    >
      {/*TODO: Uncomment this after album stuff integration*/}
      {/*<FlexRow justifyContent="flex-end">*/}
      {/*  <TouchableOpacity*/}
      {/*    style={[*/}
      {/*      uploadModeButtonCStyle,*/}
      {/*      uploadMode === UploadMode.SINGLE_TRACK && { opacity: 0.6 },*/}
      {/*    ]}*/}
      {/*    onPress={() => setUploadMode(UploadMode.SINGLE_TRACK)}*/}
      {/*    disabled={uploadMode === UploadMode.SINGLE_TRACK}*/}
      {/*  >*/}
      {/*    <BrandText style={fontSemibold12}>Upload single track</BrandText>*/}
      {/*  </TouchableOpacity>*/}
      {/*  <SpacerRow size={1} />*/}
      {/*  <TouchableOpacity*/}
      {/*    style={[*/}
      {/*      uploadModeButtonCStyle,*/}
      {/*      uploadMode === UploadMode.ALBUM && { opacity: 0.6 },*/}
      {/*    ]}*/}
      {/*    onPress={() => setUploadMode(UploadMode.ALBUM)}*/}
      {/*    disabled={uploadMode === UploadMode.ALBUM}*/}
      {/*  >*/}
      {/*    <BrandText style={fontSemibold12}>Upload album</BrandText>*/}
      {/*  </TouchableOpacity>*/}
      {/*</FlexRow>*/}

      <SpacerColumn size={2} />
      {uploadMode === UploadMode.SINGLE_TRACK ? (
        <UploadTrack onUploadDone={onClose} />
      ) : (
        <UploadAlbum onUploadDone={onClose} />
      )}
    </ModalBase>
  );
};

// const uploadModeButtonCStyle: ViewStyle = {
//   height: 24,
//   alignItems: "center",
//   justifyContent: "center",
//   paddingHorizontal: layout.spacing_x1,
//   borderRadius: 6,
//   backgroundColor: neutral30,
// };
