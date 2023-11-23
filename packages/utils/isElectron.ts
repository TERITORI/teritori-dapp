export const isElectron = () => {
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(" electron/") > -1) {
      return true;
    }
  } catch (err) {
    console.error("isElectron err", err);
  }
  return false;
};
