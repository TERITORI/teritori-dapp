import { PostCategory } from "../components/socialFeed/NewsFeed/NewsFeed.type";

export const screenTabItems = {
  all: {
    name: "Jungle News Feed",
  },
  sounds: {
    name: "Sound Feed",
    disabled: true,
  },
  videosPics: {
    name: "Video & Pic Feed",
    disabled: true,
  },
  articles: {
    name: "Articles Feed",
    disabled: true,
  },
  governance: {
    name: "Governance Feed ",
    disabled: true,
  },
};

// The Social Feed tabs doesn't fully correspond to the Posts categories, so we need to parse like this
export const feedTabToCategories = (tab: keyof typeof screenTabItems) => {
  switch (tab) {
    case "sounds":
      return [PostCategory.Audio];
    case "videosPics":
      return [PostCategory.Picture, PostCategory.Video];
    case "articles":
      return [PostCategory.Article];
    default:
      return [];
  }
};
