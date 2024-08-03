import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";

import { MakeRequestFooter } from "./Footer";
import addSVG from "../../../../assets/icons/add.svg";
import { BrandText } from "../../../components/BrandText";
import { PrimaryButtonOutline } from "../../../components/buttons/PrimaryButtonOutline";
import { RoundedGradientImage } from "../../../components/images/RoundedGradientImage";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SpacerColumn } from "../../../components/spacer";
import { useNameSearch } from "../../../hooks/search/useNameSearch";
import { useSelectedNetworkId } from "../../../hooks/useSelectedNetwork";
import useSelectedWallet from "../../../hooks/useSelectedWallet";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { errorColor, neutral77, neutralA3 } from "../../../utils/style/colors";
import { fontSemibold14, fontSemibold20 } from "../../../utils/style/fonts";
import { TNSResult } from "../components/TNSResult";
import {
  useMakeRequestState,
  zodProjectFormData,
} from "../hooks/useMakeRequestHook";

import { FileUploader } from "@/components/inputs/fileUploader";
import { LoaderFullScreen } from "@/components/loaders/LoaderFullScreen";
import { useIpfs } from "@/hooks/useIpfs";
import { ButtonsGroup } from "@/screens/Projects/components/ButtonsGroup";

export const ShortPresentation: React.FC = () => {
  const {
    actions: { goNextStep, setShortDesc },
    projectFormData: shortDescData,
  } = useMakeRequestState();
  const selectedWallet = useSelectedWallet();
  const caller = selectedWallet?.address;
  const selectedNetworkId = useSelectedNetworkId();
  const [searchTNSText, setSearchTNSText] = useState("");
  const [isTNSVisible, setIsTNSVisible] = useState(false);
  const { handleSubmit, formState, setValue, watch, setError } = useForm({
    resolver: zodResolver(zodProjectFormData),
    defaultValues: shortDescData,
  });
  const { errors } = formState;
  const values = watch();
  const { uploadToIPFS } = useIpfs();
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  useEffect(() => {
    if (!caller) {
      // TODO: would be better to not allow this corner case, aka do something smarter when no wallet is connected
      return;
    }
    setValue("creatorAddress", caller);
  }, [setValue, caller]);

  const { names } = useNameSearch({
    networkId: selectedNetworkId,
    input: searchTNSText,
    limit: 12,
  });

  if (!caller) {
    return null;
  }

  return (
    <View style={{ width: "100%", maxWidth: 480, margin: "auto" }}>
      <LoaderFullScreen visible={isUploadingCover} />

      <BrandText style={fontSemibold20}>Grant details</BrandText>

      <SpacerColumn size={1} />

      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your Grant
      </BrandText>

      <SpacerColumn size={2.5} />

      <View>
        <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
          I'm *
        </BrandText>

        <SpacerColumn size={1} />

        <ButtonsGroup
          size="XS"
          texts={[
            "A contractor looking for a funder",
            "A funder looking for a developer",
          ]}
          selectedId={values.creatorKind === "contractor" ? 0 : 1}
          onChange={async (selectedId) => {
            if (selectedId === 0) {
              setValue("creatorKind", "contractor");
            } else {
              setValue("creatorKind", "funder");
            }
          }}
        />
      </View>

      <SpacerColumn size={2.5} />

      <View style={{ position: "relative", zIndex: 2 }}>
        <TextInputCustom
          label={
            values.creatorKind === "funder"
              ? "Potential developer"
              : "Potential funder"
          }
          name="funder"
          fullWidth
          placeholder="Type the potential user address here..."
          variant="labelOutside"
          onChangeText={(text) => {
            setSearchTNSText(text);
            setIsTNSVisible(true);
            setValue("targetAddress", text);
          }}
          value={values.targetAddress}
          error={errors.targetAddress?.message}
        />

        <TNSResult
          visible={isTNSVisible && names.length > 0}
          networkId={selectedNetworkId}
          names={names}
          onSelected={(name) => {
            setIsTNSVisible(false);
            setValue("targetAddress", name);
          }}
        />
      </View>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Name *"
        name="name"
        fullWidth
        placeholder="Your Grant name"
        variant="labelOutside"
        onChangeText={(val) => setValue("name", val)}
        value={values.name}
        error={errors.name?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Description *"
        name="description"
        fullWidth
        multiline
        placeholder="Your Grant description"
        textInputStyle={{ height: 80 }}
        variant="labelOutside"
        onChangeText={(val) => setValue("description", val)}
        value={values.description}
        error={errors.description?.message}
      />

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Arbitrator address"
        name="arbitrator"
        fullWidth
        placeholder="Address of the authority that will resolve conflicts"
        variant="labelOutside"
        onChangeText={(val) => setValue("arbitratorAddress", val)}
        value={values.arbitratorAddress}
      />

      <SpacerColumn size={2.5} />

      <BrandText style={[fontSemibold14, { color: neutralA3 }]}>
        Cover Image *
      </BrandText>

      <SpacerColumn size={1.5} />

      <FileUploader
        onUpload={async (files) => {
          setIsUploadingCover(true);
          try {
            if (files[0].fileType !== "image") {
              setError("coverImg", { message: "file is not an image" });
              return;
            }
            const web3URI = await uploadToIPFS(selectedWallet.userId, files[0]);
            setValue("coverImg", web3URI);
          } finally {
            setIsUploadingCover(false);
          }
        }}
        mimeTypes={IMAGE_MIME_TYPES}
      >
        {({ onPress }) => (
          <PrimaryButtonOutline
            iconSVG={addSVG}
            text="Select file"
            fullWidth
            size="M"
            onPress={onPress}
          />
        )}
      </FileUploader>

      <SpacerColumn size={1} />

      {!!errors.coverImg && (
        <BrandText style={[fontSemibold14, { color: errorColor }]}>
          {errors.coverImg.message}
        </BrandText>
      )}

      <View style={{ alignItems: "center" }}>
        {!!values.coverImg && (
          <RoundedGradientImage size="M" square sourceURI={values.coverImg} />
        )}
      </View>

      <SpacerColumn size={2.5} />

      <TextInputCustom
        label="Tags *"
        name="tags"
        fullWidth
        placeholder="Add  1-5 main Grant tags using comma..."
        variant="labelOutside"
        onChangeText={(val) => setValue("tags", val)}
        value={values.tags || ""}
        error={errors.tags?.message}
      />

      <MakeRequestFooter
        disableNext={Object.keys(errors).length !== 0 || !values.coverImg}
        onSubmit={handleSubmit((submitValues) => {
          setShortDesc(submitValues);
          goNextStep();
        })}
      />
    </View>
  );
};
