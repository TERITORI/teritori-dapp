export const screenContainerContentMarginHorizontal = 140; // Corresponding to the space H between the Sidebar and the page content
export const leftMarginMainContent = 32;
export const headerHeight = 80;
export const MOBILE_HEADER_HEIGHT = 64;
export const legalFooterHeight = 58;
export const screenContentMaxWidth = 1092;
export const screenContentMaxWidthLarge = 1600; //"100%";
export const headerMarginHorizontal = 22;
export const avatarWidth = 40;
export const topMenuWidth = 332;
export const smallSidebarWidth = 76;
export const fullSidebarWidth = 210;
export const MOBILE_SIDEBAR_MAX_WIDTH = 500;
export const MOBILE_MAX_WIDTH = 1024;
export const RESPONSIVE_BREAKPOINT_S = 512;
export const SOCIAL_FEED_BREAKPOINT_M = 800;

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

export const layout = Object.freeze({
  base: 8,
  // 2
  get spacing_x0_25() {
    return this.base * 0.25;
  },
  // 4
  get spacing_x0_5() {
    return this.base * 0.5;
  },
  // 6
  get spacing_x0_75() {
    return this.base * 0.75;
  },
  get spacing_x1() {
    return this.base;
  },
  // 12
  get spacing_x1_5() {
    return this.base * 1.5;
  },
  // 16
  get spacing_x2() {
    return this.base * 2;
  },
  // 20
  get spacing_x2_5() {
    return this.base * 2.5;
  },
  // 24
  get spacing_x3() {
    return this.base * 3;
  },
  // 28
  get spacing_x3_5() {
    return this.base * 3.5;
  },
  // 32
  get spacing_x4() {
    return this.base * 4;
  },

  borderRadius: 12,
  contentSpacing: 48,
  topContentSpacingWithHeading: 42,
  iconButton: 32,
});
