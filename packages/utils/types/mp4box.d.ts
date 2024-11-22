declare module "mp4box" {
  export interface MP4FileInfo {
    duration: number; // Duration in timescale units
    timescale: number; // Timescale of the file
    isFragmented: boolean; // Whether the MP4 is fragmented
    brands: string[]; // Major and compatible brands
    created: Date; // Creation time
    modified: Date; // Modification time
    tracks: MP4Track[]; // Array of tracks in the file
  }

  export interface MP4Track {
    id: number; // Track ID
    type: string; // Track type (e.g., "video", "audio")
    codec: string; // Codec used for this track
    language: string; // Language of the track
    created: Date; // Creation time
    modified: Date; // Modification time
    timescale: number; // Timescale for the track
    duration: number; // Duration in timescale units
    bitrate: number; // Average bitrate of the track
    width?: number; // Video width (if applicable)
    height?: number; // Video height (if applicable)
    sampleCount: number; // Number of samples in the track
    samples: any[]; // Detailed sample information
  }

  export interface MP4ArrayBuffer extends ArrayBuffer {
    fileStart: number; // Start position of the buffer in the file
  }

  export interface MP4BoxFile {
    onReady?: (info: MP4FileInfo) => void;
    onError?: (error: string) => void;
    appendBuffer(data: ArrayBuffer): number;
    start(): void;
    stop(): void;
    flush(): void;
    createFile(): MP4BoxFile;
  }

  export function createFile(): MP4BoxFile;
}
