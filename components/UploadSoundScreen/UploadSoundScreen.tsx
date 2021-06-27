import { Button, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { uploadSound } from "./UploadSoundScreen.logic";
import { useNavigation } from "@react-navigation/native";
import { getAllMeditationTracks } from "../soundUtils";

export default function UploadSoundScreen({}) {
  const navigation = useNavigation();
  const [name, setName] = useState<string>();
  const [tracks, setTracks] = useState<string[]>();

  useEffect(() => {
    getAllMeditationTracks().then(setTracks);
  }, []);

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <TextInput
        placeholder="Please name the sound"
        style={{
          display: "flex",
          backgroundColor: "white",
          padding: 16,
          marginBottom: 12,
        }}
        value={name}
        onChangeText={(value) =>
          /^$|^[\w-\s\u0590-\u05fe]+$/.test(value) && setName(value)
        }
      />
      <Button
        title="Select to upload sound"
        disabled={!name}
        onPress={() =>
          uploadSound(tracks, name).then(
            (success) => success && navigation.goBack()
          )
        }
      />
    </View>
  );
}
