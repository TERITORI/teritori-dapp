import * as FileSystem from "expo-file-system";
import React, { useRef } from "react";
import { SafeAreaView, Text, View, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const uriToBlob = async (imageUri) => {
  const response = await fetch("http://192.168.1.66:3000/file.mp3");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const arraybuf = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arraybuf);
  return base64;
};

export const AudioContextWebview = ({ file }) => {
  function onMessage(data) {
    console.log("data", data.nativeEvent.data);
  }

  async function sendDataToWebView() {
    try {
      const base64 = await uriToBlob(file.uri);
      webviewRef.current.postMessage(base64);
    } catch (err) {
      console.log("test err", err);
    }
  }

  const webviewRef = useRef();

  return (
    <View
      style={{
        position: "absolute",
      }}
    >
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => sendDataToWebView()}
          style={{
            padding: 20,
            width: 300,
            marginTop: 100,
            backgroundColor: "red",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20, color: "white" }}>
            Send Data To WebView / Website
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "green",
        }}
      >
        <WebView
          ref={webviewRef}
          mixedContentMode="compatibility"
          onMessage={onMessage}
          webviewDebuggingEnabled
          style={{
            height: 500,
            width: 500,
            flex: 1,
          }}
          source={{
            html: ` 
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </head>
          <body
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              align-items: center;
            "
          >
            <button
            onclick="sendDataToReactNativeApp()"
              style="
                padding: 20;
                width: 200;
                font-size: 20;
                color: white;
                background-color: #6751ff;
              "
            >
              Send Data To React Native App
            </button>

            <script src="http://localhost:3000/waveform-data.js"></script>
            <script>
            const BAR_LENGTH = 200;
            window.AudioContext = window?.AudioContext || window?.webkitAudioContext;
            
            const audioContext = new AudioContext();
            
            const generateReducedWaveformArray = (waveform) => {
              const channel = waveform.channel(0);
              const maxArray = channel.max_array();
              const DATA_LENGTH_PER_BAR = Math.floor(maxArray.length / BAR_LENGTH);
            
              const bars = [];
            
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
            
            const getWaveFormFromAudio = (buffer) => {
              const options = {
                audio_context: audioContext,
                array_buffer: buffer,
                scale: 128,
              };
              return new Promise((resolve, reject) => {
               
                new  WaveformData.createFromAudio(options, (err, waveform) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(waveform);
                  }
                  if (audioContext.state !== "closed") audioContext.close();
                });
              });
            };
            
              const generateWaveForm = async (buffer) => {
              const waveform = await getWaveFormFromAudio(buffer);
              return generateReducedWaveformArray(waveform);
            };
            
            const base64ToArrayBuffer = (base64) => {
              var binaryString = window.atob(base64);
              var bytes = new Uint8Array(binaryString.length);
              for (var i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
              }
              return bytes.buffer;
          }

              const getAudioDuration = (buffer) => {

            

              return new Promise((resolve, reject) => {
                audioContext.decodeAudioData(buffer.slice(0), (buffer) => {
                  resolve(buffer.duration);
                });
              });
            };
            
              const getAudioData = async (base64) => {
                const buffer = base64ToArrayBuffer(base64);
              const duration = (await getAudioDuration(buffer)) * 1000;
              const waveform = await generateWaveForm(buffer);
            
              return {
                waveform,
                duration,
              };
            };

         

            function handleLogin () {
              const eventMethod = window.addEventListener
                ? "addEventListener"
                : "attachEvent";
              const eventer = window[eventMethod];
              const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
              eventer(
                messageEvent,
                async function (e) {
                   try{
                window.ReactNativeWebView.postMessage("message got");
                const data = await getAudioData(e.data);
                window.ReactNativeWebView.postMessage(JSON.stringify(data));
                   }catch(err) {
                    window.ReactNativeWebView.postMessage("message err"+err);
                   }
                },
                false
              );
            }

            window.onload = function () {
              window.ReactNativeWebView.postMessage('dom loaded');
              handleLogin();
            };
            
              const sendDataToReactNativeApp = async () => {
                window.ReactNativeWebView.postMessage('Data from WebView / Website');
              };
            
            </script>

          </body>
        </html>        
`,
          }}
        />
      </View>
    </View>
  );
};
