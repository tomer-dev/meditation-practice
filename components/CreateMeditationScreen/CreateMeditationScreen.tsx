import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "../Themed";
import { Sound } from "expo-av/src/Audio/Sound";
import { parseDuration } from "../utils";
import { soundDirectory } from "../../constants/Meditation";
import {
  getAllMeditationNames,
  isValidInput,
  saveMeditation,
  unloadSound,
} from "./CreateMeditationScreen.logic";
import { createBreathSound, getAllMeditationTracks } from "../soundUtils";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { HeaderTitle } from "@react-navigation/stack";

const Separator = () => <View style={styles.separator} />;

type BreathSound = {
  name: string;
  sound: Sound | null;
};

export default function CreateMeditationScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [tracks, setTracks] = useState<string[]>([]);
  const [meditationNames, setMeditationNames] = useState<string[]>();
  // const [sound, setSound] = useState<Audio.Sound>();
  const [name, setName] = useState<string>();
  const [breathIn, setBreathIn] = useState<BreathSound | null>();
  const [breathOut, setBreathOut] = useState<BreathSound | null>();
  const [breathInDuration, setBreathInDuration] = useState<number>();
  const [breathOutDuration, setBreathOutDuration] = useState<number>();
  const [duration, setDuration] = useState<number>();

  useEffect(() => unloadSound(breathOut?.sound), [breathOut]);

  useEffect(() => unloadSound(breathIn?.sound), [breathIn]);

  useEffect(() => {
    getAllMeditationTracks().then((tracks) => setTracks(tracks ?? []));
    getAllMeditationNames().then(setMeditationNames);
  }, [isFocused]);

  useEffect(
    () => () => {
      setTracks([]);
      setMeditationNames([]);
    },
    []
  );

  async function selectBreath(track: string) {
    const sound = await createBreathSound(soundDirectory + track);

    if (breathIn && !breathOut) {
      setBreathOut({ name: track, sound });
    } else {
      setBreathIn({ name: track, sound });
      setBreathOut(null);
    }
  }

  async function handleTrackPress(track: string) {
    try {
      await selectBreath(track);
    } catch (e) {
      Alert.alert(
        "Load track issue",
        "Could not select the track. Please try a different one."
      );
    }
  }

  return (
    <View>
      {/*<Text>This is where a new meditation will form, with unique name</Text>*/}
      <View style={styles.controls}>
        <TextInput
          style={{
            width: 200,
            height: 35,
            marginTop: 20,
            marginHorizontal: 5,
            backgroundColor: "#dddddd",
            color: "black",
          }}
          placeholder=" Meditation Name"
          textContentType="name"
          value={name}
          onChangeText={setName}
        />
        <View
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            marginTop: 20,
            height: 35,
            marginBottom: 5,
          }}
        >
          <View style={{ marginHorizontal: 8 }}>
            <Text>Duration (min.)</Text>
            <TextInput
              style={{
                backgroundColor: "#dddddd",
                color: "black",
              }}
              keyboardType="numeric"
              placeholder=" Duration"
              value={duration ? `${duration / 1000 / 60}` : ""}
              onChangeText={(duration) =>
                setDuration(parseDuration(duration) * 1000 * 60)
              }
            />
          </View>
          <View style={{ marginHorizontal: 8 }}>
            <Text>Inhale Duration</Text>
            <TextInput
              style={{
                backgroundColor: "#dddddd",
                color: "black",
              }}
              placeholder=" Inhale"
              value={breathInDuration ? `${breathInDuration / 1000}` : ""}
              keyboardType="numeric"
              onChangeText={(duration) =>
                setBreathInDuration(parseDuration(duration) * 1000)
              }
            />
          </View>
          <View style={{ marginHorizontal: 8 }}>
            <Text>Exhale Duration</Text>
            <TextInput
              style={{
                backgroundColor: "#dddddd",
                color: "black",
              }}
              defaultValue={`${4}`}
              keyboardType="numeric"
              placeholder=" Exhale"
              value={breathOutDuration ? `${breathOutDuration / 1000}` : ""}
              onChangeText={(duration) =>
                setBreathOutDuration(parseDuration(duration) * 1000)
              }
            />
          </View>
        </View>
        <View>
          <Separator />
          <HeaderTitle
            style={{ marginVertical: 5, fontSize: 16, color: "white" }}
          >
            {breathIn && breathOut
              ? "All set"
              : `Select ${breathIn ? "exhalation" : "inhalation"} sound:`}
          </HeaderTitle>
          <Text style={{ marginVertical: 5, fontSize: 16, color: "white" }}>
            {breathIn && `In breath: ${breathIn?.name ? breathIn.name : ""}`}
          </Text>
          <Text style={{ marginVertical: 5, fontSize: 16, color: "white" }}>
            {breathOut && `Out breath: ${breathOut.name}`}
          </Text>

          <Separator />
        </View>
      </View>

      <KeyboardAvoidingView style={styles.footer} behavior="height">
        <View>
          <Button
            title="Upload Track"
            onPress={() => navigation.navigate("UploadSoundScreen")}
          />
          {/*<Button title="Preview play" onPress={()=>meditate({duration,name, breathIn: {}})}/> */}
          <Button
            title="Save Meditation"
            disabled={
              !isValidInput(
                duration,
                breathInDuration,
                breathOutDuration,
                name,
                breathIn?.name,
                breathOut?.name,
                meditationNames
              )
            }
            onPress={() => {
              saveMeditation(
                name,
                breathIn?.name,
                breathOut?.name,
                duration,
                breathInDuration,
                breathOutDuration
              ).then((success) => success && navigation.goBack());
            }}
          />
        </View>
        <ScrollView>
          {/*TODO: put a play/stop icon in the end of each track*/}
          {tracks.map((track) => (
            <Button
              key={track}
              title={track}
              onPress={() => handleTrackPress(track)}
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
  footer: {
    height: 400,
    flexDirection: "column",
    alignContent: "space-between",
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "transparent",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
