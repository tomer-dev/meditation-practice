import React, { ReactElement, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../Themed";
import { getCurrentMeditation } from "./MeditationScreen.logic";
import { Sound } from "expo-av/build/Audio/Sound";
import { createBreathSound } from "../soundUtils";
import { meditate } from "../MeditationUtils";
import { useNavigation } from "@react-navigation/native";
import { useInterval } from "../../hooks/useInterval";
import { formatDuration } from "../utils";
import { Meditation } from "../../types";

export default function MeditationScreen(): ReactElement {
  const navigation = useNavigation();
  const [meditation, setMeditation] = useState<Meditation>();
  const [inhaleSound, setInhaleSound] = useState<Sound | null>();
  const [exhaleSound, setExhaleSound] = useState<Sound | null>();
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>();
  const [duration, setDuration] = useState<number>(0);
  const [abortController, setAbortController] = useState(new AbortController());
  const [timePassed, setTimePassed] = useState<number>(0);

  async function play() {
    if (!meditation || !inhaleSound || !exhaleSound) return;

    if (abortController.signal.aborted) {
      setAbortController(new AbortController());
    } else {
      setStartTime(new Date());
    }

    meditate(meditation, inhaleSound, exhaleSound, abortController.signal).then(
      onClose
    );
  }

  function pause() {
    const timePassed = startTime ? startTime.getTime() - Date.now() : 0;
    setDuration(Math.max(duration - timePassed, 0));
    abortController.abort();
  }

  async function onClose() {
    abortController.abort();
    await inhaleSound?.unloadAsync().then(() => setInhaleSound);
    await exhaleSound?.unloadAsync().then(() => setExhaleSound);
    setStartTime(null);
    meditation && setDuration(0);
    setPlaying(false);
    setAbortController(new AbortController());
    setTimePassed(0);
    navigation.goBack();
  }

  async function togglePausePlay() {
    if (playing) {
      setPlaying(false);
      pause();
    } else if (inhaleSound && exhaleSound) {
      setPlaying(true);
      await play();
    }
  }

  useEffect(() => {
    async function loadMeditation() {
      const meditation = await getCurrentMeditation();

      setMeditation(meditation);
      setDuration(meditation.duration);
      try {
        setInhaleSound(await createBreathSound(meditation.breathIn.uri));
        setExhaleSound(await createBreathSound(meditation.breathOut.uri));
      } catch (e) {
        Alert.alert(
          "Starting meditation failed",
          "Seems like it is a bug, please report to us."
        );
      }
    }

    loadMeditation().then(() => setLoading(false));

    return () => abortController.abort();
  }, []);

  useInterval(() => setTimePassed((t: number) => t + 1), playing ? 1000 : null);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={playing}
        onRequestClose={() => {
          onClose();
        }}
      >
        <Pressable
          onPress={onClose}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
          }}
        >
          <Text
            // title={!playing ? "Meditate" : "Pause"}
            style={{ fontSize: 32 }}
          >
            Time Passed:
          </Text>
          <Text style={{ fontSize: 26 }}>
            {formatDuration(timePassed * 1000)}
          </Text>
          <View style={{ marginTop: 140 }}>
            <Text
              style={{
                fontSize: 20,
              }}
            >
              Press to end meditation
            </Text>
          </View>
        </Pressable>
      </Modal>
      <Text>{loading ? "Loading" : ""}</Text>
      <TouchableOpacity
        style={styles.roundedButton}
        disabled={playing}
        onPress={togglePausePlay}
      >
        <Text> Meditate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 12,
    borderBottomColor: "transparent",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  roundedButton: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
    backgroundColor: "orange",
  },
});
