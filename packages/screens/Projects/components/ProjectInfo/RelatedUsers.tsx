import { Link } from "@react-navigation/native";
import React from "react";
import { Cell, Row, Table, TableWrapper } from "react-native-reanimated-table";

import { SubmitCandidacyButton } from "./LeftBlock";

import { BrandText } from "@/components/BrandText";
import { TertiaryBox } from "@/components/boxes/TertiaryBox";
import { SpacerColumn } from "@/components/spacer";
import { UsernameWithAvatar } from "@/components/user/UsernameWithAvatar";
import useSelectedWallet from "@/hooks/useSelectedWallet";
import { getUserId } from "@/networks";
import { Project } from "@/utils/projects/types";
import { neutral22, neutralA3 } from "@/utils/style/colors";
import { fontSemibold14 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

type RelatedUsersProps = {
  networkId: string;
  project: Project;
};

export const RelatedUsers: React.FC<RelatedUsersProps> = ({
  networkId,
  project,
}) => {
  const wallet = useSelectedWallet();
  const walletAddress = wallet?.address;

  const showCandidacyButton =
    !!walletAddress &&
    !!project &&
    walletAddress !== project.sender &&
    walletAddress !== project.funder &&
    !project.contractor &&
    project.status === "CREATED" &&
    !project.contractorCandidates?.includes(walletAddress);

  return (
    <TertiaryBox
      style={{
        backgroundColor: neutral22,
        borderWidth: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: layout.spacing_x2,
      }}
    >
      <Table>
        <Row
          data={["Funder", "Contractor", "Judge"]}
          textStyle={[fontSemibold14, { color: neutralA3 }]}
        />
        <SpacerColumn size={1} />
        <TableWrapper style={{ flexDirection: "row" }}>
          {[project?.funder, project?.contractor, project?.conflictHandler].map(
            (cellData, cellIndex) => {
              let content;
              if (cellIndex === 1 && !cellData) {
                if (showCandidacyButton) {
                  content = <SubmitCandidacyButton project={project} />;
                } else {
                  content = (
                    <Link to="/projects/manager/requestsByBuilders">
                      <BrandText style={fontSemibold14}>
                        {project.contractorCandidates.length} candidates
                      </BrandText>
                    </Link>
                  );
                }
              } else {
                content = (
                  <UsernameWithAvatar userId={getUserId(networkId, cellData)} />
                );
              }
              return <Cell key={cellIndex} data={content} />;
            },
          )}
        </TableWrapper>
      </Table>
    </TertiaryBox>
  );
};
