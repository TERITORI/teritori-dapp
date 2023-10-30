import { VideoFileMetadata } from "../types/files";

window.URL = window.URL || window.webkitURL;

const getVideoDuration = (file: File) => {
  let duration = 0;
  try {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(file.path);
      video.src = window.URL.createObjectURL(file);
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
