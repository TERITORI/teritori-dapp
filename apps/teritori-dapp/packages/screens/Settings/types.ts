export interface SettingItemGroupType {
  [key: string]: SettingItemType;
}

export interface SettingItemType {
  title: string;
  description: string;
  state: boolean;
}
