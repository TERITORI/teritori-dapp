import moment from "moment/moment";
import React, { FC } from "react";
import { View } from "react-native";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { TextInputCustom } from "@/components/inputs/TextInputCustom";
import { SpacerColumn } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import { getUserId, parseNetworkObjectId } from "@/networks";
import { PartyRole } from "@/screens/Projects/ProjectsConflictSolvingScreen/types";
import { useProject } from "@/screens/Projects/hooks/useProjects";
import { errorColor, neutral17 } from "@/utils/style/colors";
import { fontSemibold28 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const SettledConflictsSection: FC<{
  projectId: string | undefined;
}> = ({ projectId }) => {
  const [network] = parseNetworkObjectId(projectId);
  const networkId = network?.id;
  const { data: project } = useProject(projectId);
  return (
    <>
      <BrandText style={[fontSemibold28]}>Settled conflicts</BrandText>
      {[...(project?.conflicts || [])]
        .reverse()
        .filter((c) => !!c.outcome)
        .map((conflict, index) => {
          let responderAddress;
          if (conflict.initiator === project?.contractor) {
            responderAddress = project?.funder;
          } else {
            responderAddress = project?.contractor;
          }

          let initiatorRole: PartyRole;
          if (conflict.initiator === project?.contractor) {
            initiatorRole = "contractor";
          } else {
            initiatorRole = "funder";
          }
          let responderRole: PartyRole;
          if (responderAddress === project?.contractor) {
            responderRole = "contractor";
          } else {
            responderRole = "funder";
          }

          let outcomeColor, outcomeText;
          switch (conflict.outcome) {
            case "RESUME_CONTRACT":
              outcomeColor = "white";
              outcomeText = "Project resumed";
              break;
            case "REFUND_FUNDER":
              outcomeColor = errorColor;
              outcomeText = "Funder reimbursed";
              break;
            case "PAY_CONTRACTOR":
              outcomeColor = errorColor;
              outcomeText = "Contractor paid";
              break;
            default:
              outcomeColor = errorColor;
              outcomeText = "Unknown outcome";
              break;
          }

          return (
            <>
              <SpacerColumn size={3} />
              <TertiaryBox
                style={{
                  backgroundColor: neutral17,
                  padding: layout.spacing_x2,
                  borderWidth: 0,
                  marginBottom: layout.spacing_x2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText>
                    Initial message by {initiatorRole} on{" "}
                    {moment(conflict.createdAt).format("MMM D, YYYY")}
                  </BrandText>
                  <UsernameWithAvatar
                    userId={getUserId(networkId, conflict?.initiator)}
                  />
                </View>
                <SpacerColumn size={2} />
                <TextInputCustom
                  value={conflict?.initiatorMessage}
                  disabled
                  label=""
                  name="initialMessage"
                  placeholder="Enter details here..."
                  hideLabel
                  multiline
                  noBrokenCorners
                  containerStyle={{ width: "100%" }}
                  textInputStyle={{ height: 80 }}
                />

                <SpacerColumn size={3} />

                {conflict.respondedAt ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <BrandText>
                        Response by {responderRole} on{" "}
                        {moment(conflict.respondedAt).format("MMM D, YYYY")}
                      </BrandText>
                      <UsernameWithAvatar
                        userId={getUserId(networkId, responderAddress)}
                      />
                    </View>
                    <SpacerColumn size={2} />
                    <TextInputCustom
                      value={conflict.responseMessage || undefined}
                      disabled
                      label=""
                      name="responseMessage"
                      hideLabel
                      multiline
                      noBrokenCorners
                      containerStyle={{ width: "100%" }}
                      textInputStyle={{ height: 80 }}
                    />
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <BrandText style={{ color: errorColor }}>
                        No response from {responderRole} after{" "}
                        {moment(conflict.createdAt).fromNow(true)}
                      </BrandText>
                      <UsernameWithAvatar
                        userId={getUserId(networkId, responderAddress)}
                      />
                    </View>
                  </>
                )}

                <SpacerColumn size={3} />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <BrandText>
                    Verdict on{" "}
                    {moment(conflict.resolvedAt).format("MMM D, YYYY")}
                  </BrandText>
                  <UsernameWithAvatar
                    userId={getUserId(networkId, project?.conflictHandler)}
                  />
                </View>
                <SpacerColumn size={2} />
                <TextInputCustom
                  value={conflict.resolutionMessage || undefined}
                  disabled
                  label=""
                  name="resolutionMessage"
                  hideLabel
                  multiline
                  noBrokenCorners
                  containerStyle={{ width: "100%" }}
                  textInputStyle={{ height: 80 }}
                />
                <SpacerColumn size={2} />
                <BrandText
                  style={{
                    color: outcomeColor,
                  }}
                >
                  {outcomeText}
                </BrandText>
              </TertiaryBox>
            </>
          );
        })}
    </>
  );
};
