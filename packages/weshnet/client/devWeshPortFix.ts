function bootListener() {
  const oldPushState = history.pushState;
  history.pushState = function pushState() {
    const ret = oldPushState.apply(this, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };

  const oldReplaceState = history.replaceState;
  history.replaceState = function replaceState() {
    const ret = oldReplaceState.apply(this, arguments);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"));
  });
}

export const fixWeshPortURLParams = () => {
  bootListener();

  const queryString = window.location.search;
  window.addEventListener("locationchange", (event) => {
    const url = window.location.href;
    let newURL = url;
    if (url.includes("?")) {
      if (!url.includes("weshPort")) {
        newURL = `${url}&${queryString.replace("?", "")}`;
      }
    } else {
      newURL = `${url}${queryString}`;
    }
    if (url !== newURL) {
      window.history.replaceState({}, "", newURL);
    }
  });
};
