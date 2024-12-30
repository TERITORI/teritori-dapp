export const MENTION_REGEX = /(@[\w&.-]+)/;
export const URL_REGEX =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
// export const IPFS_URI_REGEX = /^ipfs:\/\/.*/;
export const HASHTAG_REGEX = /#\S+/;
export const HTML_TAG_REGEXP = /(<([^>]+)>)/gi;
export const GIF_URL_REGEX = /https?:\/\/.*\.(gif)(\?.*)?$/;
export const NUMBERS_REGEXP = /^\d+$/;
export const LETTERS_REGEXP = /^[A-Za-z]+$/;
export const EMAIL_REGEXP = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/;
export const NUMBERS_COMMA_SEPARATOR_REGEXP = /^\s*\d+(\s*,\s*\d+)*\s*$/;
