import AsyncStorage from "@react-native-async-storage/async-storage";
import { currentMeditation } from "../../constants/Meditation";
import { formatDuration } from "../utils";
import { Meditation } from "../../types";

function excludeCurrentMeditation(keys: string[]) {
  const index = keys.findIndex((key) => key === "@" + currentMeditation);

  if (index === -1) return keys;

  return [...keys.slice(0, index), ...keys.slice(index + 1)];
}

export async function getAllMeditations(): Promise<Meditation[]> {
  try {
    return AsyncStorage.multiGet(
      await AsyncStorage.getAllKeys().then(excludeCurrentMeditation)
    ).then((meditationsJson) =>
      meditationsJson.map(([, jsonValue]) =>
        jsonValue ? JSON.parse(jsonValue) : null
      )
    );
  } catch (e) {
    console.error("Getting meditations from storage failed:", e);
    return [];
  }
}

export async function selectMeditation(
  meditation: Meditation
): Promise<boolean> {
  try {
    await AsyncStorage.setItem(
      "@" + currentMeditation,
      JSON.stringify(meditation)
    );

    return true;
  } catch (e) {
    console.error("Storing a meditation from storage failed:", e);
    return false;
  }
}

export function formatMeditation(meditation: Meditation) {
  return `Duration - ${formatDuration(meditation.duration)}
Breath in: ${formatDuration(meditation.breathIn.duration)} - ${
    meditation.breathIn.trackName
  }
Breath out: ${formatDuration(meditation.breathOut.duration)} - ${
    meditation.breathOut.trackName
  }`;
}
