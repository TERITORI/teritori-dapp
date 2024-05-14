import React, { FC } from "react";

import { TableColumns, TableHeader } from "@/components/table/TableHeader";
import { useIsMobile } from "@/hooks/useIsMobile";
import { layout } from "@/utils/style/layout";

// Header used for tables at left (always visible)
export const TableStaticHeader: FC<{ staticColumns: TableColumns }> = ({
  staticColumns,
}) => {
  const isMobile = useIsMobile();
  return (
    <TableHeader
      columns={staticColumns}
      style={{
        paddingLeft: isMobile ? layout.spacing_x1 : layout.spacing_x2_5,
        borderTopRightRadius: 0,
      }}
    />
  );
};
