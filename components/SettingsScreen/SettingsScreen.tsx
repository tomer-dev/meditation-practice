import { Button, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { HeaderTitle } from "@react-navigation/stack";
import React from "react";
import { alertReset, ResetAlert } from "./SettingsScreen.logic";
import { Text } from "../Themed";

const Separator = () => <View style={styles.separator} />;

export function SettingsScreen() {
  return (
    <KeyboardAvoidingView
      style={{
        marginBottom: 60,
        marginHorizontal: 8,
        flex: 1,
      }}
    >
      <View style={{ margin: 20 }}>
        <Text>Warning: this will erase all existing meditations.</Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <Button
          color="rgba(255,0,0,0.6)"
          title="Reset meditations"
          onPress={() => alertReset(ResetAlert.Programs)}
        />
      </View>
      <Separator />
      <View style={{ margin: 20 }}>
        <Text>Warning: this will erase all existing sounds.</Text>
      </View>
      <Button
        color="rgba(255,0,0,0.6)"
        title="Reset sounds"
        onPress={() => alertReset(ResetAlert.Sounds)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  separator: {
    marginVertical: 16,
    borderBottomColor: "rgba(255,255,255,0.4)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
