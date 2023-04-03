import React from "react";
import { View, StyleSheet } from "react-native";

import PdfIcon from "../../../../assets/icons/pdf.svg";
import PicIcon from "../../../../assets/icons/pic.svg";
import VideoIcon from "../../../../assets/icons/video.svg";
import WarningIcon from "../../../../assets/icons/warning.svg";
import { GigInfo } from "../../../screens/FreelanceServices/types/fields";
import { ipfsPinataUrl, uploadFileToIPFS } from "../../../utils/ipfs";
import {
  neutralA3,
  neutral33,
  secondaryColor,
  neutral00,
} from "../../../utils/style/colors";
import {
  fontMedium10,
  fontMedium13,
  fontMedium16,
  fontSemibold13,
  fontSemibold14,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { BrandText } from "../../BrandText";
import { SVG } from "../../SVG";
import { CheckBox } from "../../checkbox/CheckBox";
import { DragDropFile, GigUploadFileType } from "../../inputs/DragDropFile";

const pageContentWidth = 760;
const cardWidth = 240;
const cardHeight = 180;

export const GigCreationGallery: React.FC<{
  gigInfo: GigInfo;
  setGig: React.Dispatch<React.SetStateAction<GigInfo>>;
}> = ({ gigInfo, setGig }) => {
  const uploadImageFile = async (file: File) => {
    if (file) {
      const ipfsHash = await uploadFileToIPFS(file);
      const images = gigInfo.images;
      images.push(ipfsHash);
      setGig({ ...gigInfo, images });
    }
  };

  const uploadPdfFile = async (file: File) => {
    if (file) {
      const ipfsHash = await uploadFileToIPFS(file);
      const documents = gigInfo.documents;
      documents.push(ipfsHash);
      setGig({ ...gigInfo, documents });
    }
  };

  return (
    <View style={styles.pageContent}>
      <BrandText>
        Get all the information you need from buyers to get started
      </BrandText>
      <BrandText style={[styles.text, { marginTop: layout.padding_x2 }]}>
        Add questions to help buyers provide you with exactly what you need to
        start working on their order.
      </BrandText>

      <BrandText style={styles.subTitle}>Images (up to 3)</BrandText>
      <BrandText style={styles.text}>
        Get noticed by the buyers with visual examples of your services.
      </BrandText>
      <View style={styles.oneLine}>
        <DragDropFile
          setFile={uploadImageFile}
          url={
            gigInfo.images.length >= 1 ? ipfsPinataUrl(gigInfo.images[0]) : ""
          }
        >
          <SVG source={PicIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
        </DragDropFile>
        <DragDropFile
          setFile={uploadImageFile}
          url={
            gigInfo.images.length >= 2 ? ipfsPinataUrl(gigInfo.images[1]) : ""
          }
        >
          <SVG source={PicIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
        </DragDropFile>
        <DragDropFile
          setFile={uploadImageFile}
          url={
            gigInfo.images.length >= 3 ? ipfsPinataUrl(gigInfo.images[2]) : ""
          }
        >
          <SVG source={PicIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a Photo or</BrandText>
        </DragDropFile>
      </View>

      <BrandText style={styles.subTitle}>Video (only one)</BrandText>
      <BrandText style={styles.text}>
        Capture buyers' attention with a video that showcases your service.
      </BrandText>
      <BrandText style={styles.tipText}>
        Please choose a video shorter than 75 seconds and smaller than 50MB
      </BrandText>
      <DragDropFile
        setFile={uploadPdfFile}
        accept={"video/*"}
        url={
          gigInfo.documents.length >= 1
            ? ipfsPinataUrl(gigInfo.documents[0])
            : ""
        }
        fileType={GigUploadFileType.PDF}
      >
        <SVG source={VideoIcon} width={32} height={32} />
        <BrandText style={styles.cardText}>Drag & drop a Video or</BrandText>
      </DragDropFile>
      <BrandText style={styles.subTitle}>Documents (up to 2)</BrandText>
      <BrandText style={styles.text}>
        Show some of the best work you created in a document (PDFs only).
      </BrandText>
      <View style={{ flexDirection: "row" }}>
        <DragDropFile
          setFile={uploadPdfFile}
          accept="application/pdf"
          url={
            gigInfo.documents.length >= 1
              ? ipfsPinataUrl(gigInfo.documents[0])
              : ""
          }
          fileType={GigUploadFileType.PDF}
        >
          <SVG source={PdfIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a PDF or</BrandText>
        </DragDropFile>
        <DragDropFile
          setFile={uploadPdfFile}
          accept="application/pdf"
          url={
            gigInfo.documents.length >= 2
              ? ipfsPinataUrl(gigInfo.documents[1])
              : ""
          }
          fileType={GigUploadFileType.PDF}
        >
          <SVG source={PdfIcon} width={32} height={32} />
          <BrandText style={styles.cardText}>Drag & drop a PDF or</BrandText>
        </DragDropFile>
      </View>
      <View style={styles.policyBox}>
        <CheckBox
          value={gigInfo.approveLicense}
          onValueChange={() => {
            setGig({ ...gigInfo, approveLicense: !gigInfo.approveLicense });
          }}
        />
        <BrandText style={[fontSemibold13, { color: neutralA3 }]}>
          I declare that materials were created by myself or by my team and do
          not infringe on any 3rd part insights. I understand that the illegal
          use of digital assets is against Teritori’s Terms of Service and may
          result blocking my account.*
        </BrandText>
      </View>
      <View style={styles.warningBox}>
        <SVG source={WarningIcon} width={16} height={16} />
        <BrandText style={[fontMedium13, { color: neutralA3 }]}>
          Please confirm that you’ve read and agreed to our Terms of Service
        </BrandText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    flexDirection: "column",
    width: pageContentWidth,
  },
  text: StyleSheet.flatten([
    fontSemibold14,
    {
      color: neutralA3,
    },
  ]),
  subTitle: StyleSheet.flatten([
    fontSemibold14,
    {
      marginBottom: layout.padding_x1_5,
      marginTop: layout.padding_x4,
    },
  ]),
  oneLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  questionInput: StyleSheet.flatten([
    fontSemibold14,
    {
      padding: layout.padding_x2,
      borderWidth: 1,
      borderColor: neutral33,
      borderRadius: layout.padding_x1_5,
      color: secondaryColor,
      marginBottom: layout.padding_x2,
    },
  ]),
  divideLine: {
    height: 1,
    width: "100%",
    backgroundColor: neutral33,
  },
  mediaCard: {
    width: cardWidth,
    height: cardHeight,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderColor: neutral33,
    borderRadius: layout.padding_x1_5,
    backgroundColor: neutral00,
    borderWidth: 1,
    marginTop: layout.padding_x1_5,
    position: "relative",
  },
  cardText: StyleSheet.flatten([
    fontMedium16,
    {
      color: neutralA3,
      marginTop: layout.padding_x1_5,
      marginBottom: layout.padding_x1,
    },
  ]),
  tipText: StyleSheet.flatten([
    fontMedium10,
    {
      color: neutralA3,
    },
  ]),
  policyBox: {
    flexDirection: "row",
    gap: layout.padding_x1_5,
    alignItems: "center",
    marginTop: layout.padding_x4,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: layout.padding_x1_5,
    marginTop: layout.padding_x2,
  },
});
