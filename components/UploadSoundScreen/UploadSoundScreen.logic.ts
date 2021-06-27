import { copyAsync, documentDirectory, moveAsync } from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { createBreathSound } from "../soundUtils";
import { Alert } from "react-native";

export function isNameUnique(tracks?: string[], name?: string) {
  return !tracks?.some(
    (track) => track.toLocaleLowerCase() === name?.toLocaleLowerCase()
  );
}

function extractExtension(filename?: string) {
  return filename?.substring(filename.lastIndexOf(".")) || filename;
}

export async function uploadSound(tracks?: string[], name?: string) {
  try {
    const document = await getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: false,
    });

    if (document.type === "cancel") {
      return;
    }

    const filename = name
      ? name + extractExtension(document.name)
      : document.name;

    if (!isNameUnique(tracks, filename)) {
      Alert.alert(
        "Upload track failed",
        "Duplicate names. Please give a unique sound name."
      );
      return false;
    }

    await createBreathSound(document.uri);

    await copyAsync({
      from: document.uri,
      to: documentDirectory + "Audio",
    });

    if (filename !== document.name) {
      await moveAsync({
        from: documentDirectory + "Audio/" + document.name,
        to: documentDirectory + "Audio/" + filename,
      });
    }

    return true;
  } catch (e) {
    Alert.alert(
      "Upload track failed",
      "Could not upload the track. Please try a different one."
    );
    return false;
  }
}
