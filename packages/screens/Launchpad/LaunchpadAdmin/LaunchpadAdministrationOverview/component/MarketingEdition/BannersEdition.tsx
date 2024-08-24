import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import cameraSVG from "@/assets/icons/camera.svg";
import { BrandText } from "@/components/BrandText";
import { SVG } from "@/components/SVG";
import { BoxStyle } from "@/components/boxes/Box";
import { CustomPressable } from "@/components/buttons/CustomPressable";
import { HubBanner } from "@/components/hub/HubBanner/HubBanner";
import { HubBannerImage } from "@/components/hub/HubBanner/HubBannerImage";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { FileUploader } from "@/components/inputs/fileUploader";
import { SpacerColumn, SpacerRow } from "@/components/spacer";
import { useBanners } from "@/hooks/marketing/useBanners";
import { useMaxResolution } from "@/hooks/useMaxResolution";
import { useSelectedNetworkId } from "@/hooks/useSelectedNetwork";
import { EditButton } from "@/screens/Launchpad/LaunchpadAdmin/LaunchpadAdministrationOverview/component/MarketingEdition/EditButton";
import { IMAGE_MIME_TYPES } from "@/utils/mime";
import { neutral17, primaryColor } from "@/utils/style/colors";
import { fontSemibold13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";
import { BannerForm, ZodBannerForm } from "@/utils/types/banners";

// TODO: Multiple Banners ?
export const BannersEdition: FC = () => {
  const networkId = useSelectedNetworkId();
  const banners = useBanners(networkId);
  const banner = banners?.length ? banners[0] : undefined;
  const { width } = useMaxResolution();
  const [isEditing, setIsEditing] = useState(false);
  const bannerForm = useForm<BannerForm>({
    mode: "all",
    resolver: zodResolver(ZodBannerForm),
    defaultValues: {
      image: banner?.image || "",
      url: banner?.url || "",
    },
  });
  const image = bannerForm.watch("image");
  const url = bannerForm.watch("url");

  return (
    <View style={{ width, alignSelf: "center" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <EditButton
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isSaveDisabled={
            !bannerForm.formState.isValid ||
            (banner?.url === url && banner?.image === image)
          }
          onPressSave={() => {
            bannerForm.handleSubmit(() => {
              // TODO:
              bannerForm.reset();
            })();
          }}
          onPressCancel={() => bannerForm.reset()}
        />

        {isEditing && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <TextInputCustom
              label=""
              name="url"
              noBrokenCorners
              variant="regular"
              placeHolder="Banner URL or page"
              control={bannerForm.control}
              containerStyle={{
                maxWidth: 400,
                width: "100%",
              }}
              height={40}
            />
            <SpacerRow size={2} />

            <Controller<BannerForm>
              control={bannerForm.control}
              name="image"
              render={({ field: { onChange } }) => (
                <FileUploader
                  onUpload={(files) => {
                    onChange(files[0].url);
                  }}
                  mimeTypes={IMAGE_MIME_TYPES}
                >
                  {({ onPress }) => (
                    <CustomPressable
                      onPress={onPress}
                      style={changeImageButton}
                    >
                      <SVG
                        width={16}
                        height={16}
                        source={cameraSVG}
                        color={neutral17}
                      />
                      <BrandText
                        numberOfLines={1}
                        style={[
                          fontSemibold13,
                          {
                            color: neutral17,
                            marginLeft: layout.spacing_x1_25,
                          },
                        ]}
                      >
                        Change Banner's image
                      </BrandText>
                    </CustomPressable>
                  )}
                </FileUploader>
              )}
            />
          </View>
        )}
      </View>
      <SpacerColumn size={3} />

      {isEditing && <HubBannerImage sourceURI={image} width={width} />}

      {!isEditing && banner && <HubBanner banner={banner} />}
    </View>
  );
};

const changeImageButton: BoxStyle = {
  flexDirection: "row",
  alignSelf: "flex-start",
  borderRadius: 6,
  alignItems: "center",
  justifyContent: "center",
  paddingRight: layout.spacing_x1_5,
  paddingLeft: layout.spacing_x2,
  paddingVertical: layout.spacing_x1,
  backgroundColor: primaryColor,
  height: 40,
};
