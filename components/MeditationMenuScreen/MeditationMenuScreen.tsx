import React, { useEffect, useState } from "react";
import { Button, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "../Themed";
import {
  formatMeditation,
  getAllMeditations,
  selectMeditation,
} from "./MeditationMenuScreen.logic";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Meditation } from "../../types";

export default function MeditationMenuScreen({}) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [meditations, setMeditations] = useState<Meditation[]>();

  useEffect(() => {
    getAllMeditations().then(setMeditations);
  }, [isFocused]);

  useEffect(() => () => setMeditations([]), []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.newMeditation}>
        <Button
          title="Create Meditation"
          onPress={() => navigation.navigate("CreateMeditationScreen")}
        />
      </View>
      <ScrollView>
        {meditations?.map((meditation, index) => (
          <View style={styles.container} key={index}>
            <Button
              title={meditation.name}
              onPress={() =>
                selectMeditation(meditation).then(() =>
                  navigation.navigate("MeditationScreen")
                )
              }
            />
            <Text style={styles.details}>{formatMeditation(meditation)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
  },
  container: {
    marginVertical: 16,
    marginHorizontal: 12,
    borderColor: "#002222",
    borderWidth: 2,
    borderRadius: 8,
  },
  details: {
    marginVertical: 4,
    marginRight: 4,
  },
  newMeditation: {
    marginTop: 20,
    marginHorizontal: 76,
    marginBottom: 16,
  },
});
