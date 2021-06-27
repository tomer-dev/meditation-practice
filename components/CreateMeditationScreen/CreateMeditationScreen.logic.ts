import AsyncStorage from "@react-native-async-storage/async-storage";
import { documentDirectory } from "expo-file-system";
import { Audio } from "expo-av";
import { Meditation } from "../../types";

export async function getAllMeditationNames() {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (e) {
    console.error("Getting keys from storage failed:", e);
    return [];
  }
}

export function isMeditationNameUnique(
  meditationName: string,
  meditationNames?: string[]
) {
  return !meditationNames?.includes(meditationName);
}

export function isValidInput(
  duration?: number,
  breathInDuration?: number,
  breathOutDuration?: number,
  name?: string,
  breathInTrack?: string,
  breathOutTrack?: string,
  meditationNames?: string[]
) {
  if (Array.from(arguments).some((argument) => argument === undefined)) {
    return false;
  }

  // @ts-ignore
  if (duration <= 0 || breathInDuration <= 0 || breathOutDuration <= 0) {
    return false;
  }

  // @ts-ignore
  return isMeditationNameUnique(name, meditationNames);
}
async function validateMeditationInput(
  duration?: number,
  breathInDuration?: number,
  breathOutDuration?: number,
  name?: string,
  breathInTrack?: string,
  breathOutTrack?: string,
  meditationNames?: string[]
) {
  let missingError = "",
    invalidError = "",
    nameNotUniqueError = "",
    error;

  if (!name) missingError += "name";
  if (!breathInTrack)
    missingError += missingError ? ", breath-in track" : " breath-in track";
  if (!breathOutTrack)
    missingError += missingError ? ", breath-out track" : " breath-out track";
  if (!duration)
    missingError += missingError
      ? ", meditation duration"
      : "meditation duration";
  if (!breathInDuration)
    missingError += missingError
      ? ", breath-in duration"
      : "breath-in duration";
  if (!breathOutDuration)
    missingError += missingError
      ? ", breath-out duration"
      : "breath-out duration";

  missingError = missingError ? "Please fill in: " + missingError + "." : "";

  if (duration !== undefined && duration <= 0) invalidError += "duration";
  if (breathInDuration !== undefined && breathInDuration <= 0)
    invalidError += invalidError
      ? ", breath-in duration"
      : "breath-in duration";
  if (breathOutDuration !== undefined && breathOutDuration <= 0)
    invalidError += invalidError
      ? ", breath-out duration"
      : "breath-out duration";

  invalidError = invalidError
    ? "Numbers are invalid: " + invalidError + "."
    : "";

  if (name && !isMeditationNameUnique(name, meditationNames)) {
    nameNotUniqueError = "Meditation name is not unique.";
  }

  error = missingError + invalidError + nameNotUniqueError;

  if (error) window.alert(error);

  return !error;
}

export async function saveMeditation(
  name?: string,
  breathInTrack?: string,
  breathOutTrack?: string,
  duration?: number,
  breathInDuration?: number,
  breathOutDuration?: number
) {
  const isValidInput = await validateMeditationInput(
    duration,
    breathInDuration,
    breathOutDuration,
    name,
    breathInTrack,
    breathOutTrack
  );

  if (!isValidInput) return false;

  const meditation: Meditation = {
    name: name as string,
    duration: duration ?? 0,
    breathIn: {
      duration: breathInDuration ?? 0,
      trackName: breathInTrack as string,
      uri: documentDirectory + "Audio/" + breathInTrack,
    },
    breathOut: {
      duration: breathOutDuration ?? 0,
      trackName: breathOutTrack as string,
      uri: documentDirectory + "Audio/" + breathOutTrack,
    },
  };

  return storeMeditation(meditation);
}

export async function storeMeditation(
  meditation: Meditation
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      "@" + meditation.name,
      JSON.stringify(meditation)
    );

    return true;
  } catch (e) {
    console.error("Storing a meditation from storage failed:", e);
    return false;
  }
}

export function unloadSound(sound?: Audio.Sound | null) {
  sound?.unloadAsync();
}
