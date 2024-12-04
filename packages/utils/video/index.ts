import MP4Box, { MP4ArrayBuffer, MP4BoxFile, MP4FileInfo } from "mp4box";

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

export const getVideoDurationFromBuffer = async (buffer: ArrayBuffer) => {
  let duration = 0;
  const mp4boxFile: MP4BoxFile = MP4Box.createFile();

  mp4boxFile.onReady = (info: MP4FileInfo) => {
    const durationInSec = info.duration / info.timescale;
    duration = durationInSec * 1000;
  };

  const fileData = buffer.slice(0);
  (fileData as MP4ArrayBuffer).fileStart = 0;
  mp4boxFile.appendBuffer(fileData);

  return duration;
};

export const getVideoDurationFromURL = async (url: string) => {
  let duration = 0;

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const buffer = await response.arrayBuffer();

    duration = await getVideoDurationFromBuffer(buffer);
  } catch (error) {
    console.log(error);
  }

  return duration;
};

export const getVideoData = async (file: File): Promise<VideoFileMetadata> => {
  const fileBuffer = await file.arrayBuffer();
  const duration = await getVideoDurationFromBuffer(fileBuffer);

  return {
    duration,
  };
};
