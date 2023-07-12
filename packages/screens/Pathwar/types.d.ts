import { Category, Tag } from "../../api/pathwar/v1/pathwar";

export interface CategoryFilter extends Category {
  selected: boolean;
}
export interface TagFilter extends Tag {
  selected: boolean;
}
