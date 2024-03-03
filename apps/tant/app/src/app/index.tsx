import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Mic, StopCircle, UploadCloud } from "react-native-feather";
import {
  createRecording,
  updateRecording,
  uploadFileToPresignedUrl,
} from "../lib/recordings";
import { useRecording } from "../lib/useRecording";

// Move this to the public repo
// Create tant-api repo in the public repo, move getPresignedUrl there
// When getpresignedurl is called, create a vn file in directus and save presigned url and status (new)
// When file upload is complete, ping /file/:id/complete and update status to uploaded
// https://github.com/innovatorved/whisper.api
// https://whisperapi.com
// ffmpeg https://codeshare.io/NKWXp9
//

export default function App() {
  const { isRecording, toggle, elapsed, files } = useRecording();
  const list = files.map((file) => ({
    key: file.split("/").at(-1)?.split("-").at(-1)!,
    uri: file,
    fileName: file.split("/").at(-1)!,
  }));

  const handleUpload = async (fileName: string, fileUri: string) => {
    console.log("handle upload", fileName);

    const recording = await createRecording(fileName);
    await uploadFileToPresignedUrl(recording.presigned_url!, fileUri);
    await updateRecording(recording.id);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text>tant</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.list}>
            <FlatList
              data={list}
              renderItem={({ item }) => (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>{item.key}</Text>
                  <Pressable
                    onPress={() => handleUpload(item.fileName, item.uri)}
                  >
                    <UploadCloud />
                  </Pressable>
                </View>
              )}
            />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Pressable
          onPress={() => {
            toggle();
          }}
          style={{
            ...styles.recording,
            backgroundColor: isRecording ? "black" : "red",
          }}
        >
          {isRecording ? <StopCircle color="white" /> : <Mic color="white" />}
        </Pressable>
        <Text style={{ opacity: isRecording ? 1 : 0 }}>
          Recording... {elapsed}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // gap: 20,
    // display: "flex",
    // padding: 20,
    // backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
    display: "flex",
  },
  header: {},
  footer: {
    display: "flex",
    alignItems: "center",
  },
  list: {
    maxHeight: 480,
  },
  content: {},
  recording: {
    backgroundColor: "#ef4444",
    width: 65,
    height: 65,
    borderRadius: 50,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
