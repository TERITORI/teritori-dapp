import React, { FC } from "react";

import { TableColumns, TableHeader } from "@/components/table/TableHeader";
import { layout } from "@/utils/style/layout";

// Header used for tables at right in a ScrollView
export const TableScrollableHeader: FC<{ scrollableColumns: TableColumns }> = ({
  scrollableColumns,
}) => {
  return (
    <TableHeader
      columns={scrollableColumns}
      style={{
        width: "100%",
        marginRight: layout.spacing_x1,
        borderTopLeftRadius: 0,
      }}
    />
  );
};
