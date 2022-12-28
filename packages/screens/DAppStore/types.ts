export interface dAppType {
  id: string;
  title: string;
  description: string;
  icon: string;
  isChecked: boolean;
  order: number;
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
