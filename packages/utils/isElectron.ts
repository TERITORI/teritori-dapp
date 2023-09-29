export const isElectron = () => {
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    console.log("userAgent", userAgent);
    if (userAgent.indexOf(" electron/") > -1) {
      return true;
    }
  } catch (err) {
    console.log("err", err);
  }
  return false;
};
