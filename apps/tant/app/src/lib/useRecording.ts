import { Audio } from "expo-av";
import { useEffect, useState } from "react";

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recording, setRecording] = useState<Audio.Recording>();
  // TODO: probably move outside
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isRecording) {
        setElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  const start = async () => {
    setElapsed(0);
    setIsRecording(true);

    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission..");
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stop = async () => {
    setIsRecording(false);

    console.log("Stopping recording..");
    setRecording(undefined);
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording?.getURI();
    console.log("Recording stopped and stored at", uri);

    setFiles((prev) => [...prev, uri!]);

    if (!uri) {
      throw new Error("No uri");
    }
  };

  return {
    isRecording: !!recording,
    start,
    stop,
    toggle: () => {
      if (isRecording) {
        stop();
      } else {
        start();
      }
    },
    elapsed,
    files,
  };
};
