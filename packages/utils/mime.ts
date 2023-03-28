export const AUDIO_MIME_TYPES = ["audio/aac", "audio/mpeg"];
export const VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime"];
export const GIF_MIME_TYPE = "image/gif";
export const IMAGE_MIME_TYPES = [
  GIF_MIME_TYPE,
  "image/jpeg",
  "image/x-png",
  "image/png",
];

export const FEED_POST_SUPPORTED_MIME_TYPES = [
  ...AUDIO_MIME_TYPES,
  ...VIDEO_MIME_TYPES,
  ...IMAGE_MIME_TYPES,
];
