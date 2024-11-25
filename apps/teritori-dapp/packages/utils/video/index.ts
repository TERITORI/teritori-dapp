import { VideoFileMetadata } from "../types/files";

const getVideoDuration = (file: File) => {
  let duration = 0;
  try {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const windowURL = window.URL || window.webkitURL;
      windowURL.revokeObjectURL(file.path);
      video.src = windowURL.createObjectURL(file);
      duration = video.duration;
    };

    video.onerror = () => {
      console.error("Invalid video");
    };
  } catch (e) {
    console.error("Fail to get video duration: ", e);
  }
  return duration;
};

export const getVideoData = (file: File): VideoFileMetadata => {
  const duration = getVideoDuration(file) * 1000;
  return {
    duration,
  };
};
