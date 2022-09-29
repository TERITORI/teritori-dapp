export const helpAreaWidth = 188;
export const screenContainerContentMarginHorizontal = 140; // Corresponding to the space H between the Sidebar and the page content
export const headerHeight = 80;
export const footerHeight = 82;
export const screenContentMaxWidth = 1092;
export const headerMarginHorizontal = 22;
export const avatarWidth = 40;

export const layout = {
  padding_x1: 8,
  get padding_x0_5() {
    return this.padding_x1 * 0.5; // 4
  },
  get padding_x1_5() {
    return this.padding_x1 * 1.5; // 12
  },
  get padding_x2() {
    return this.padding_x1 * 2; // 16
  },
  get padding_x2_5() {
    return this.padding_x1 * 2.5; // 20
  },
  get padding_x3() {
    return this.padding_x1 * 3; // 24
  },
  get padding_x3_5() {
    return this.padding_x1 * 3.5; // 28
  },
  get padding_x4() {
    return this.padding_x1 * 4; // 32
  },
  borderRadius: 12,
  contentPadding: 48,
  icon: 32,
};
