import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";

import { MetadataUpdateModal } from "./modals/MetadataUpdateModal";
import { SelectFileUploader } from "../../../components/inputs/selectFileUploader";
import { NewCollectionAssetsFormValues } from "../../../utils/types/launchpad";

import { SelectedFilesPreview } from "@/components/FilePreview/SelectedFilesPreview/SelectedFilesPreview";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral33 } from "@/utils/style/colors";
import { layout } from "@/utils/style/layout";
import { LocalFileData } from "@/utils/types/files";

export const AssetsTab: React.FC = () => {
  const [files, setFiles] = useState<LocalFileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<LocalFileData>();

  const [medataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);

  const { control } = useForm<NewCollectionAssetsFormValues>({
    defaultValues: {
      nftApiKey: "",
    },
    mode: "all",
  });
  return (
    <SafeAreaView
      style={{
        width: "100%",
        flex: 1,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        {/* ===== Left container */}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              maxWidth: 416,
              margin: layout.spacing_x2,
            }}
          >
            <View>
              {/*TODO: Remove this field ?*/}
              <TextInputLaunchpad<NewCollectionAssetsFormValues>
                label="NFT.Storage API Key"
                placeHolder="My Awesome Collection"
                name="nftApiKey"
                control={control}
              />

              <SelectFileUploader
                label="Asset selection"
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                }}
                containerHeight={100}
                multiple
                onUpload={(files) => {
                  setFiles(files);
                }}
                mimeTypes={IMAGE_MIME_TYPES}
                isRequired={false}
              />
              <SelectFileUploader
                label="Metadata selection"
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                }}
                containerHeight={100}
                multiple
                onUpload={(files) => {}}
                mimeTypes={IMAGE_MIME_TYPES}
                isRequired={false}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            width: 1,
            backgroundColor: neutral33,
            margin: layout.spacing_x2,
          }}
        />

        {/* ===== Right container */}
        <View
          style={{
            justifyContent: "flex-start",
            width: "100%",
            flex: 1,
            margin: layout.spacing_x2,
          }}
        >
          <SelectedFilesPreview
            assets={files}
            onSelect={(item) => {
              setMedataUpdateModalVisible(true);
              setSelectedFile(item);
            }}
          />
        </View>

        {selectedFile && (
          <MetadataUpdateModal
            onClose={() => setMedataUpdateModalVisible(false)}
            isVisible={medataUpdateModalVisible}
            item={selectedFile}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
