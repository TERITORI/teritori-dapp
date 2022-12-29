export const helpAreaWidth = 188;
export const screenContainerContentMarginHorizontal = 140; // Corresponding to the space H between the Sidebar and the page content
export const mobileScreenContainerContentMarginHorizontal = 20;
export const headerHeight = 80;
export const legalFooterHeight = 58;
export const screenContentMaxWidth = 1092;
export const screenContentMaxWidthLarge = 1290;
export const headerMarginHorizontal = 22;
export const avatarWidth = 40;
export const walletSelectorWidth = 220;
export const smallSidebarWidth = 76;
export const fullSidebarWidth = 210;

const BASE_SIZE = 8;

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
