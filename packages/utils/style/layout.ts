export const screenContainerContentMarginHorizontal = 140; // Corresponding to the space H between the Sidebar and the page content
export const headerHeight = 80;
export const MOBILE_HEADER_HEIGHT = 64;
export const legalFooterHeight = 58;
export const screenContentMaxWidth = 1092;
export const screenContentMaxWidthLarge = 1290;
export const headerMarginHorizontal = 22;
export const avatarWidth = 40;
export const topMenuWidth = 332;
export const smallSidebarWidth = 76;
export const fullSidebarWidth = 210;
export const MOBILE_SIDEBAR_MAX_WIDTH = 500;
export const NEWS_FEED_MAX_WIDTH = 900;
export const MOBILE_MAX_WIDTH = 1024;
export const SOCIAL_FEED_BREAKPOINT_L = 1100;
export const RESPONSIVE_BREAKPOINT_S = 512;

const BASE_SIZE = 8;

export const getResponsiveScreenContainerMarginHorizontal = (width: number) => {
  if (width >= 992) {
    return 140;
  } else if (width >= 768) {
    return 80;
  } else if (width >= 576) {
    return 60;
  } else {
    return 15;
  }
};

export const getMobileScreenContainerMarginHorizontal = (width: number) => {
  if (width >= 992) {
    return 60;
  } else if (width >= 768) {
    return 30;
  } else {
    return 16;
  }
};

export const layout = {
  padding_x1: BASE_SIZE,
  // 2
  get padding_x0_25() {
    return this.padding_x1 * 0.25;
  },
  // 4
  get padding_x0_5() {
    return this.padding_x1 * 0.5;
  },
  // 6
  get padding_x0_75() {
    return this.padding_x1 * 0.75;
  },
  // 12
  get padding_x1_5() {
    return this.padding_x1 * 1.5;
  },
  // 16
  get padding_x2() {
    return this.padding_x1 * 2;
  },
  // 20
  get padding_x2_5() {
    return this.padding_x1 * 2.5;
  },
  // 24
  get padding_x3() {
    return this.padding_x1 * 3;
  },
  // 28
  get padding_x3_5() {
    return this.padding_x1 * 3.5;
  },
  // 32
  get padding_x4() {
    return this.padding_x1 * 4;
  },

  borderRadius: 12,
  contentPadding: 48,
  iconButton: 32,
};
