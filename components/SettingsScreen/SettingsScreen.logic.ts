import { deleteAsync, documentDirectory } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function resetSounds() {
  try {
    await deleteAsync(documentDirectory + "Audio");
  } catch (e) {
    console.warn(e);
  }
}

export async function resetPrograms() {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.warn(e);
  }
}

export enum ResetAlert {
  Sounds = "sounds",
  Programs = "meditation programs",
}

export function alertReset(messageType?: ResetAlert) {
  Alert.alert(
    "Warning",
    `Are you sure you would like to reset all ${messageType}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress:
          messageType === ResetAlert.Programs
            ? resetPrograms
            : messageType === ResetAlert.Sounds
            ? resetSounds
            : undefined,
      },
    ],
    { cancelable: false }
  );
}
