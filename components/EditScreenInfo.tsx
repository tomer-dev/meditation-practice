import React, { useEffect, useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "./Themed";
import {
  copyAsync,
  deleteAsync,
  documentDirectory,
  readDirectoryAsync,
} from "expo-file-system";
import { getDocumentAsync } from "expo-document-picker";
import { Sound } from "expo-av/src/Audio/Sound";
import { Audio } from "expo-av/src";

import { sleep } from "./utils";
import { NavigationProp } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Separator = () => <View style={styles.separator} />;

export default function EditScreenInfo({
  navigation,
}: {
  navigation: NavigationProp<any>;
}) {
  const [tracks, setTracks] = useState<string[]>([]);
  const [breathIn, setBreathIn] = useState<Sound | null>();
  const [breathOut, setBreathOut] = useState<Sound | null>();
  const [breathInDuration, setBreathInDuration] = useState<number>(4 * 1000);
  const [breathOutDuration, setBreathOutDuration] = useState<number>(4 * 1000);
  const [duration, setDuration] = useState<number>(3 * 60 * 1000);

  async function playRoutine() {
    console.log("Play sounds");

    const endTime = Date.now() + duration;

    while (endTime - Date.now() - breathInDuration - breathOutDuration > 0) {
      if (!breathIn || !breathOut) return;

      await breathIn?.replayAsync();
      await sleep(30);
      await breathOut?.stopAsync();

      if (!breathIn || !breathOut) return;

      await sleep(breathInDuration);
      await breathOut?.replayAsync();
      await sleep(30);
      await breathIn?.stopAsync();

      await sleep(breathOutDuration);
    }
    await breathOut?.stopAsync();
  }

  async function playSound(track: string) {
    console.log("Loading Sound");

    const { sound } = await Audio.Sound.createAsync({
      uri: documentDirectory + "Audio/" + track,
    });

    if (!breathIn) {
      setBreathIn(sound);
    } else {
      setBreathOut(sound);
    }
  }

  React.useEffect(() => {
    return breathOut
      ? () => {
          console.log("Unloading Sound");
          breathOut?.unloadAsync();
        }
      : undefined;
  }, [breathOut]);

  React.useEffect(() => {
    return breathIn
      ? () => {
          console.log("Unloading Sound");
          breathIn?.unloadAsync();
        }
      : undefined;
  }, [breathIn]);

  useEffect(() => {
    try {
      readDirectoryAsync(documentDirectory + "Audio/").then(setTracks);
    } catch (e) {
      console.log(e);
    }

    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
    });
  }, []);

  async function handleHelpPress() {
    const document = await getDocumentAsync({
      type: "audio/*",
      copyToCacheDirectory: false,
    });

    if (document.type === "cancel") {
      return;
    }

    await copyAsync({
      from: document.uri,
      to: documentDirectory + "Audio",
    });

    readDirectoryAsync(documentDirectory + "Audio").then(setTracks);
  }

  async function resetPlayer() {
    if (!tracks?.length) return;

    try {
      await Promise.all([breathIn?.unloadAsync(), breathOut?.unloadAsync()]);
      setBreathIn(null);
      setBreathOut(null);
    } catch (e) {
      console.error(e);
    }
  }

  async function formatAudioDirectory() {
    await resetPlayer();
    setTracks([]);
    try {
      await deleteAsync(documentDirectory + "Audio");
      await AsyncStorage.clear();
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      <View style={styles.controls}>
        <Text
          style={styles.getStartedText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          This will{" "}
          <Button
            title="format"
            disabled={!tracks.length}
            onPress={formatAudioDirectory}
          />{" "}
          all the downloaded files
        </Text>

        <View
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            marginTop: 40,
            height: 30,
            marginBottom: 5,
          }}
        >
          <TextInput
            style={{
              width: 60,
              marginHorizontal: 5,
              backgroundColor: "#dddddd",
              color: "black",
            }}
            keyboardType="numeric"
            placeholder="  Duration"
            defaultValue={`${3}`}
            onChangeText={(number) =>
              typeof +number === "number" && setDuration(+number * 1000 * 60)
            }
          />
          <TextInput
            style={{
              width: 60,
              marginHorizontal: 5,
              backgroundColor: "#dddddd",
              color: "black",
            }}
            placeholder="  Inhale"
            defaultValue={`${4}`}
            keyboardType="numeric"
            onChangeText={(number) =>
              typeof +number === "number" && setBreathInDuration(+number * 1000)
            }
          />
          <TextInput
            style={{
              width: 60,
              marginHorizontal: 5,
              backgroundColor: "#dddddd",
              color: "black",
            }}
            defaultValue={`${4}`}
            keyboardType="numeric"
            placeholder="  Exhale"
            onChangeText={(number) =>
              typeof +number === "number" &&
              setBreathOutDuration(+number * 1000)
            }
          />
        </View>
        <View>
          <Separator />
          <Button
            title="reset program"
            disabled={!breathIn && !breathOut}
            onPress={resetPlayer}
          />
          <Text
            lightColor="rgba(0,0,0,0.8)"
            darkColor="rgba(255,255,255,0.8)"
            style={{ marginVertical: 5, fontSize: 16 }}
          >
            {breathIn && breathOut
              ? "All set"
              : `Select ${breathIn ? "out" : "in"} breath`}
          </Text>
          <Button
            title="Play Routine"
            disabled={!breathOut || !breathIn}
            onPress={playRoutine}
          />
          <Separator />
          <Button
            title="Move to Create Meditation"
            onPress={() => {
              navigation.navigate("Meditation");
            }}
          />
        </View>
      </View>

      <KeyboardAvoidingView style={styles.trackList} behavior="height">
        <ScrollView>
          {tracks.map((track) => (
            <Button
              key={track}
              title={track}
              onPress={() => playSound(track)}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 5,
  },
  controls: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 50,
    marginBottom: 20,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightContainer: {
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 5,
    textAlign: "center",
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: "center",
  },
  trackList: {
    flex: 1,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "transparent",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
