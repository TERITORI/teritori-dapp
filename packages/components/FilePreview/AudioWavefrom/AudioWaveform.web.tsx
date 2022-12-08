// AUDIO CONTEXT

import { useEffect, useState } from "react";
import { View } from "react-native";
import WaveformData from "waveform-data";

import { neutral55, secondaryColor } from "../../../utils/style/colors";

//@ts-ignore
window.AudioContext = window.AudioContext || window?.webkitAudioContext;

const audioContext = new AudioContext();

const BAR_LENGTH = 77;
const BAR_MAX_HEIGHT = 18;

export const AudioWaveform = ({
  fileURL,
  positionPercent,
}: {
  fileURL: string;
  positionPercent: number;
}) => {
  const [waveItems, setWaveItems] = useState<number[]>([]);

  const generateBars = (waveform: WaveformData) => {
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

    const barMax = Math.max(...bars);
    const newBars = bars.map((item) => (item / barMax) * BAR_MAX_HEIGHT);
    setWaveItems(newBars);
  };

  function loadMusic(url: string) {
    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
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
            audioContext.close();
          });
        });
      })
      .then((waveform) => {
        generateBars(waveform as WaveformData);
      });
  }
  useEffect(() => {
    loadMusic(fileURL);
  }, []);

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      {waveItems.map((item, index) => (
        <View
          key={index}
          style={{
            width: 2,
            height: item,
            marginRight: 1,
            backgroundColor:
              index < Math.floor(positionPercent * BAR_LENGTH)
                ? secondaryColor
                : neutral55,
          }}
        />
      ))}
    </View>
  );
};
