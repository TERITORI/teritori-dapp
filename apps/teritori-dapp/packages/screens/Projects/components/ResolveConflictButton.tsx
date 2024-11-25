import React, { FC } from "react";

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useAppNavigation } from "@/utils/navigation";

export const ResolveConflictButton: FC<{
  projectId: string | undefined;
}> = ({ projectId }) => {
  const navigation = useAppNavigation();
  return (
    <>
      <PrimaryButton
        text="Resolve conflict"
        loader
        onPress={() => {
          if (!projectId) {
            return;
          }
          navigation.navigate("ProjectsConflictSolving", {
            projectId,
          });
        }}
        size="SM"
        width={280}
      />
    </>
  );
};
