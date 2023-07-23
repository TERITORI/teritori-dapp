import WaveformData from "waveform-data";

import { BAR_LENGTH } from "./constants";
import { AudioFileMetadata } from "../types/files";

//@ts-ignore
window.AudioContext = window?.AudioContext || window?.webkitAudioContext;

const audioContext = new AudioContext();

const generateReducedWaveformArray = (waveform: WaveformData) => {
  const channel = waveform.channel(0);
  const maxArray = channel.max_array();
  const DATA_LENGTH_PER_BAR = Math.floor(maxArray.length / BAR_LENGTH);

  const bars: number[] = [];

  for (let x = 0; x < BAR_LENGTH; x++) {
    const sum = maxArray
      .slice(
        x * DATA_LENGTH_PER_BAR,
        x * DATA_LENGTH_PER_BAR + DATA_LENGTH_PER_BAR + 1
      )
      .reduce((a, b) => a + b, 0);

    const avg = Math.floor(sum / DATA_LENGTH_PER_BAR || 0);
    bars.push(avg);
  }
  return bars;
};

const getWaveFormFromAudio = (buffer: ArrayBuffer): Promise<WaveformData> => {
  const options = {
    audio_context: audioContext,
    array_buffer: buffer,
    scale: 128,
  };
  return new Promise((resolve, reject) => {
    WaveformData.createFromAudio(options, (err, waveform) => {
      if (err) {
        reject(err);
      } else {
        resolve(waveform);
      }
      if (audioContext.state !== "closed") audioContext.close();
    });
  });
};

export const generateWaveForm = async (buffer: ArrayBuffer) => {
  const waveform = await getWaveFormFromAudio(buffer);
  return generateReducedWaveformArray(waveform);
};

export const getAudioDuration = (buffer: ArrayBuffer): Promise<number> => {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(buffer.slice(0), (buffer) => {
      resolve(buffer.duration);
    });
  });
};

export const getAudioData = async (audio: any): Promise<AudioFileMetadata> => {
  const buffer: ArrayBuffer = await audio.arrayBuffer();
  const duration = (await getAudioDuration(buffer)) * 1000;
  const waveform = await generateWaveForm(buffer);

  return {
    waveform,
    duration,
  };
};
