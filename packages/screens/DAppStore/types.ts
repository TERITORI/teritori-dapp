export interface dAppType {
  id: string;
  title: string;
  description: string;
  icon: string;
  isChecked: boolean;
  groupKey: string;
}

export interface dAppGroup {
  [key: string]: {
    id: string;
    groupName: string;
    icon: string;
    options: {
      [key: string]: dAppType;
    };
  };
}
