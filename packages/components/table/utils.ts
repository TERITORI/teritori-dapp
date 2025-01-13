import { fontRegular12, fontRegular13 } from "@/utils/style/fonts";
import { layout } from "@/utils/style/layout";

export const tableColumnsGap = layout.spacing_x1;
export const tablePaddingHorizontal = layout.spacing_x2;
export const tableHeaderHeight = 48;
export const tableRowHeight = 50;
export const tableCellTextStyle = fontRegular13;
export const tableHeaderTextStyle = fontRegular12;

export interface TableColumns {
  [key: string]: { label: string; flex: number; minWidth?: number };
}
