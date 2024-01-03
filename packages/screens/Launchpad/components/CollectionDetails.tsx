import React from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";

import { BrandText } from "../../../components/BrandText";
import { TextInputCustom } from "../../../components/inputs/TextInputCustom";
import { SelectFileUploader } from "../../../components/selectFileUploader";
import { SpacerColumn } from "../../../components/spacer";
import { IMAGE_MIME_TYPES } from "../../../utils/mime";
import { ARTICLE_THUMBNAIL_IMAGE_HEIGHT } from "../../../utils/social-feed";
import {
  neutral00,
  neutral33,
  neutral55,
  neutral77,
} from "../../../utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "../../../utils/style/fonts";
import { layout } from "../../../utils/style/layout";
import { NewCollectionDetailsFormValues } from "../CreateCollection.type";

export const CollectionDetails: React.FC = () => {
  const { control } = useForm<NewCollectionDetailsFormValues>({
    defaultValues: {
      name: "",
      description: "",
      symbol: "",
      externalLink: "",
      websiteLink: "",
      twitterProfileUrl: "",
      twitterFollowers: "",
      discordName: "",
      email: "",
    },
    mode: "onBlur",
  });

  return (
    <View style={styles.container}>
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Collection details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your collection
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Name"
        placeHolder="My Awesome Collection"
        name="name"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Description"
        placeHolder="My Awesome Collection Description"
        name="description"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Symbol"
        placeHolder="Symbol"
        name="symbol"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <SelectFileUploader
        label="Cover Image "
        fileHeight={ARTICLE_THUMBNAIL_IMAGE_HEIGHT}
        isImageCover
        style={{
          marginVertical: layout.spacing_x3,
          width: 416,
        }}
        onUpload={(files) => {}}
        mimeTypes={IMAGE_MIME_TYPES}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: false }}
        label="What network is your project on? *"
        placeHolder="Select Network"
        name="externalLink"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: false }}
        label="External Link"
        placeHolder="https://collection..."
        name="externalLink"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: false }}
        label="Website Link"
        placeHolder="https://website..."
        name="websiteLink"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Twitter Profile *"
        placeHolder="https://twitter..."
        name="twitterProfileUrl"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="How many Twitter followers does your project have? "
        placeHolder="10,000"
        name="twitterFollowers"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Discord name of your main contact: "
        placeHolder="nickname#0000"
        name="discordName"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Main contact email address: "
        placeHolder="contact@email.com"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      {/* <View style={[styles.section, { justifyContent: "flex-end" }]}>
        <LegacyTertiaryBox height={42} width={80}>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            activeOpacity={1}
            onPress={() => onPressDropdownButton(dropdownRef)}
          >
            <BrandText
              style={[fontSemibold14, { marginRight: layout.spacing_x1 }]}
            >
              {itemsPerPage}
            </BrandText>
            <SVG
              source={
                isDropdownOpen(dropdownRef) ? chevronUpSVG : chevronDownSVG
              }
              width={16}
              height={16}
              color={secondaryColor}
            />
          </TouchableOpacity>
        </LegacyTertiaryBox>

        {isDropdownOpen(dropdownRef) && (
          <Box
            style={{
              position: "absolute",
              top: 46,
              right: 0,
              width: 80,
              paddingHorizontal: layout.spacing_x1_5,
              paddingTop: layout.spacing_x1_5,
              backgroundColor: neutral33,
              alignItems: "flex-start",
            }}
          >
            {dropdownOptions.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setItemsPerPage(item);
                  closeOpenedDropdown();
                }}
                key={index}
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: layout.spacing_x1_5,
                  },
                ]}
              >
                <BrandText
                  style={[fontSemibold13, { marginLeft: 12, color: neutralA3 }]}
                >
                  {item}
                </BrandText>
              </TouchableOpacity>
            ))}
          </Box>
        )}
      </View> */}
      {/* <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Is your project a derivative project? "
        placeHolder="contact@email.com"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      /> */}
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Project type:"
        placeHolder="Multiple answers allowed"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Describe your project: "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. What's your concept?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. How is it different?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. What's your goal?
            </BrandText>
          </View>
        }
        placeHolder="Describe here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Have you previously applied for the same project before? "
        placeHolder="Select Option"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Describe your team:"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. How many core members are you? ( Working on the project daily )
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. Who does what in your team?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. Past accomplishments or projects?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              4. How did you guys meet?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              5. Please add Linkedin links for all your members.
            </BrandText>
          </View>
        }
        placeHolder="Describe here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Team links and attachments "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Please provide any relevant links regarding your team. You can
              also post a google drive link.
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Do you have any partners on the project? "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              If yes, who are they? What do they do for you?
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="What have you invested in this project so far?"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. How much upfront capital has been invested?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. Have you raised outside funding for the project?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. How long has the project been worked on?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              4. Is there a proof of concept or demo to show?
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: false }}
        label="Investment links and attachments "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Please provide any relevant links regarding your investment. You
              can also post a google drive link.
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Whitepaper and roadmap: "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Please provide any relevant links regarding your whitepaper and
              roadmap. You can also post a google drive link.
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Please describe your artwork: "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. Is it completely original?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. Who is the artist?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. How did your team meet the artist?
            </BrandText>
          </View>
        }
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Is your collection ready for the mint? "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. Is it completely original?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. Who is the artist?
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. How did your team meet the artist?
            </BrandText>
          </View>
        }
        placeHolder="Select Option"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="What is your expected collection supply?"
        placeHolder="Type here..."
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="What is your expected public sale mint price? "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Just type the number in your Network currency:
            </BrandText>
          </View>
        }
        placeHolder="0"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />

      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="What is your expected mint date? "
        placeHolder="dd.mm.yyyy | hh:mm PM"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="If selected for the launchpad, You will escrow mint proceeds for this time period: "
        placeHolder="Select Option"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Are you dox or have you planned to dox?"
        placeHolder="Select Option"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="If selected for the launchpad, you will comply with all the requirements below: "
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              1. One team member will KYC.
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              2. Sign a formal legal partnership agreement.
            </BrandText>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              3. Escrow funds with Teritori following the mint.
            </BrandText>
          </View>
        }
        placeHolder="dd.mm.yyyy | hh:mm PM"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="We'd love to offer TeritoriDAO members 10% of your whitelist supply if your project is willing. Please let us know how many whitelist spots you'd be willing to allocate our DAO: "
        placeHolder="0"
        name="email"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
        labelStyle={styles.labelStyle}
      />

      <View style={{ borderBottomWidth: 1, borderColor: neutral33 }} />
      <SpacerColumn size={2} />
      <BrandText style={fontSemibold20}>Minting details</BrandText>
      <SpacerColumn size={1} />
      <BrandText style={[fontSemibold14, { color: neutral77 }]}>
        Information about your minting settings
      </BrandText>
      <SpacerColumn size={2} />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Number of Tokens"
        placeHolder="0"
        name="name"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Unit Price"
        placeHolder="0"
        name="name"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Price of each token (min. 50 TORI)
            </BrandText>
          </View>
        }
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Per Address Limit"
        placeHolder="0"
        name="name"
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
      <TextInputCustom<NewCollectionDetailsFormValues>
        rules={{ required: true }}
        label="Start Time"
        placeHolder="--.--.---- --:--"
        name="name"
        sublabel={
          <View>
            <BrandText style={[fontSemibold13, { color: neutral55 }]}>
              Start time for the minting
            </BrandText>
          </View>
        }
        control={control}
        variant="labelOutside"
        containerStyle={{ marginBottom: layout.spacing_x3 }}
        boxMainContainerStyle={{
          backgroundColor: neutral00,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

// FIXME: remove StyleSheet.create
// eslint-disable-next-line no-restricted-syntax
const styles = StyleSheet.create({
  container: {
    maxWidth: 416,
  },
  labelStyle: {
    maxWidth: 416,
  },
});
