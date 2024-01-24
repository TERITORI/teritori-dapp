export interface PaginationProps {
  currentPage: number;
  maxPage: number;
  onChangePage: (page: number) => void;
}
