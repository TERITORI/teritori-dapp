import { SvgProps } from "react-native-svg";

export interface PaginationProps {
  currentPage: number;
  maxPage: number;
  onChangePage: (page: number) => void;
}

export interface PaginationBlockProps {
  source: React.FC<SvgProps> | string;
  onPress: () => void;
}
