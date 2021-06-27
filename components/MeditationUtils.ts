import { Sound } from "expo-av/build/Audio/Sound";
import { sleep } from "./utils";
import { Meditation } from "../types";

export async function meditate(
  {
    duration,
    breathIn: { duration: inhaleDuration },
    breathOut: { duration: exhaleDuration },
  }: Meditation,
  inhaleSound: Sound,
  exhaleSound: Sound,
  abortSignal: AbortSignal
) {
  const stop = () => {
    inhaleSound?.stopAsync();
    exhaleSound?.stopAsync();
  };

  const shouldAbort = () => {
    return !inhaleSound || !exhaleSound || abortSignal.aborted;
  };

  const alternatePlayToInhale = async () => {
    await inhaleSound?.replayAsync();
    await sleep(30);
    await exhaleSound?.stopAsync();

    if (shouldAbort()) {
      stop();
      return;
    }

    await sleep(inhaleDuration);
  };

  const alternatePlayToExhale = async () => {
    await exhaleSound?.replayAsync();
    await sleep(30);
    await inhaleSound?.stopAsync();

    await sleep(exhaleDuration);
  };

  if (shouldAbort()) {
    stop();
    return;
  }

  const endTime = Date.now() + duration;

  try {
    while (endTime - Date.now() - inhaleDuration - exhaleDuration > 0) {
      if (shouldAbort()) {
        stop();
        return;
      }
      await alternatePlayToInhale();
      if (shouldAbort()) {
        stop();
        return;
      }
      await alternatePlayToExhale();
    }

    await exhaleSound?.stopAsync();
  } catch (e) {
    (abortSignal.aborted && console.info("Aborting meditation")) ||
      console.error(e);
  }
}
