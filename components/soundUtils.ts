import { Sound } from "expo-av/build/Audio/Sound";
import { documentDirectory, readDirectoryAsync } from "expo-file-system";
import { Audio } from "expo-av/src/index";

export async function createBreathSound(uri: string): Promise<Sound | null> {
  try {
    return await Sound.createAsync({
      uri,
    }).then((asset) => asset.sound);
  } catch (e) {
    return Promise.resolve(null);
  }
}

export async function createSound(track: string) {
  return await Audio.Sound.createAsync({
    uri: documentDirectory + "Audio/" + track,
  }).then((result) => result.sound);
}

export async function getAllMeditationTracks() {
  try {
    return await readDirectoryAsync(documentDirectory + "Audio/");
  } catch (e) {
    return [];
  }
}
