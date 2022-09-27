// import original module declarations
import "styled-components";

// extend them
declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      error: string;
      neutral44: string;
      neutral77: string;
      neutral22: string;
      neutral33: string;

      codGray: string;
      mineShaft: string;
      reef: string;
    };
    layout: {
      window: { width: number; height: number };
      screen: { width: number; height: number };
      padding_x0_5: number;
      padding_x1: number;
      padding_x1_5: number;
      padding_x2: number;
      padding_x2_5: number;
      padding_x3: number;
      padding_x3_5: number;
      padding_x4: number;
      contentPadding: number;
      borderRadius: number;
      icon: number;
    };
  }
}
