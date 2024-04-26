import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { View } from "react-native";

import { CollectionFormValues } from "../../../../../utils/types/launchpad";
import { SelectInputLaunchpad } from "../../../components/inputs/selectInputs/SelectInputLaunchpad";

import { BrandText } from "@/components/BrandText";
import { ErrorText } from "@/components/ErrorText";
import { SpacerColumn } from "@/components/spacer";
import { DateTimeInputLaunchpad } from "@/screens/Launchpad/components/inputs/DateTimeInputLaunchpad";
import { TextInputLaunchpad } from "@/screens/Launchpad/components/inputs/TextInputLaunchpad";
import { neutral55, neutral77 } from "@/utils/style/colors";
import {
  fontSemibold13,
  fontSemibold14,
  fontSemibold20,
} from "@/utils/style/fonts";

export const LaunchpadAdditional: React.FC = () => {
  const collectionForm = useFormContext<CollectionFormValues>();
  const escrowMintProceedsPeriod = collectionForm.watch(
    "escrowMintProceedsPeriod",
  );
  const isReadyForMint = collectionForm.watch("isReadyForMint");
  const isDox = collectionForm.watch("isDox");
  const expectedMintDate = collectionForm.watch("expectedMintDate");
  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <View style={{ width: 416 }}>
        <BrandText style={fontSemibold20}>Additional Information</BrandText>
        <SpacerColumn size={1} />
        <BrandText style={[fontSemibold14, { color: neutral77 }]}>
          Fill the additional information
        </BrandText>
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
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
          placeHolder="Describe here..."
          name="artworkDescription"
          form={collectionForm}
        />

        <Controller<CollectionFormValues>
          name="isReadyForMint"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <>
              <SelectInputLaunchpad
                dropdownOptions={["Yes", "No"]}
                placeHolder="Select Option"
                item={
                  isReadyForMint === true
                    ? "Yes"
                    : isReadyForMint === false
                      ? "No"
                      : ""
                }
                onPressItem={(item) => {
                  onChange(item === "Yes");
                }}
                label="Is your collection ready for the mint?"
              />
              <ErrorText>
                {collectionForm.getFieldState("isReadyForMint").error?.message}
              </ErrorText>
            </>
          )}
        />
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="What is your expected collection supply?"
          placeHolder="Type here..."
          name="expectedSupply"
          form={collectionForm}
        />

        <TextInputLaunchpad<CollectionFormValues>
          label="What is your expected public sale mint price?"
          sublabel={
            <View>
              <BrandText style={[fontSemibold13, { color: neutral55 }]}>
                Just type the number in your Network currency:
              </BrandText>
            </View>
          }
          placeHolder="0"
          name="expectedPublicMintPrice"
          form={collectionForm}
        />

        <Controller<CollectionFormValues>
          name="expectedMintDate"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <DateTimeInputLaunchpad
              label="What is your expected mint date?"
              onChange={onChange}
              timestamp={expectedMintDate}
            />
          )}
        />
        <SpacerColumn size={2} />

        <Controller<CollectionFormValues>
          name="escrowMintProceedsPeriod"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <>
              <SelectInputLaunchpad
                dropdownOptions={["1", "2", "3"]}
                placeHolder="Select Option"
                item={escrowMintProceedsPeriod?.toString()}
                onPressItem={(item) => {
                  onChange(item);
                }}
                label="If selected for the launchpad, You will escrow mint proceeds for this time period:"
                style={{ zIndex: 2 }}
              />
              <ErrorText>
                {
                  collectionForm.getFieldState("escrowMintProceedsPeriod").error
                    ?.message
                }
              </ErrorText>
            </>
          )}
        />
        <SpacerColumn size={2} />

        <Controller<CollectionFormValues>
          name="isDox"
          control={collectionForm.control}
          render={({ field: { onChange } }) => (
            <>
              <SelectInputLaunchpad
                dropdownOptions={["Yes", "No"]}
                placeHolder="Select Option"
                item={isDox === true ? "Yes" : isDox === false ? "No" : ""}
                onPressItem={(item) => {
                  onChange(item === "Yes");
                }}
                label="Are you dox or have you planned to dox?"
                style={{ zIndex: 1 }}
              />
              <ErrorText>
                {collectionForm.getFieldState("isDox").error?.message}
              </ErrorText>
            </>
          )}
        />
        <SpacerColumn size={2} />

        <TextInputLaunchpad<CollectionFormValues>
          label="We'd love to offer TeritoriDAO members 10% of your whitelist supply if your project is willing. Please let us know how many whitelist spots you'd be willing to allocate our DAO: "
          placeHolder="0"
          name="daoWhitelistCount"
          form={collectionForm}
        />
      </View>
    </View>
  );
};
