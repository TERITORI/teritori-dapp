import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, View } from "react-native";

import { SelectedFilesPreview } from "../../../components/FilePreview/SelectedFilesPreview";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { MetadataUpdateModal } from "../../../components/modals/collection/MetadataUpdateModal";
import { SelectFileUploader } from "../../../components/selectFileUploader";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { neutral00, neutral33 } from "../../../utils/style/colors";
import { layout } from "../../../utils/style/layout";
import { LocalFileData } from "../../../utils/types/files";
import { NewCollectionFormValues } from "../CreateCollection.type";

export const AssetsTab: React.FC = () => {
  const [files, setFiles] = useState<LocalFileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<LocalFileData>();

  const [medataUpdateModalVisible, setMedataUpdateModalVisible] =
    useState(false);

  const { control } = useForm<NewCollectionFormValues>({
    defaultValues: {
      nftApiKey: "",
    },
    mode: "onBlur",
  });
  return (
    <SafeAreaView
      style={{
        width: "100%",
        flex: 1,
        borderBottomWidth: 1,
        borderColor: neutral33,
        marginBottom: 10,
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
              <TextInputCustom<NewCollectionFormValues>
                rules={{ required: true }}
                label="NFT.Storage API Key"
                placeHolder="My Awesome Collection"
                name="nftApiKey"
                control={control}
                variant="labelOutside"
                containerStyle={{ marginBottom: layout.spacing_x3 }}
                boxMainContainerStyle={{
                  backgroundColor: neutral00,
                  borderRadius: 12,
                }}
              />
              <SelectFileUploader
                label="Asset selection"
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                  maxHeight: 100,
                }}
                multiple
                onUpload={(files) => {
                  setFiles(files);
                }}
                mimeTypes={IMAGE_MIME_TYPES}
              />
              <SelectFileUploader
                label="Metadata selection"
                style={{
                  marginVertical: layout.spacing_x3,
                  width: 416,
                  maxHeight: 100,
                }}
                multiple
                onUpload={(files) => {}}
                mimeTypes={IMAGE_MIME_TYPES}
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